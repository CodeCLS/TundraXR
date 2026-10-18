package com.tundra.tundraxr

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.core.content.ContextCompat
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.xr.compose.platform.LocalSession
import androidx.xr.compose.platform.LocalSpatialCapabilities
import androidx.xr.scenecore.scene
import com.tundra.tundraxr.capture.DeviceCamera
import com.tundra.tundraxr.data.Device
import com.tundra.tundraxr.data.ManualTarget
import com.tundra.tundraxr.data.Source
import com.tundra.tundraxr.ui.island.HomeSpaceIslandWorkspace
import com.tundra.tundraxr.ui.island.SpatialIslandWorkspace
import com.tundra.tundraxr.ui.theme.TundraXRTheme
import com.tundra.tundraxr.voice.HandsFreeCallbacks
import com.tundra.tundraxr.voice.HandsFreeListener
import com.tundra.tundraxr.voice.HAND_TRACKING_PERMISSION
import com.tundra.tundraxr.voice.PinchToTalk
import com.tundra.tundraxr.voice.VoiceCallbacks
import com.tundra.tundraxr.voice.rememberVoiceInput
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            TundraXRTheme {
                val session = LocalSession.current
                val vm: SessionViewModel = viewModel()
                val state by vm.state.collectAsStateWithLifecycle()
                val voice = rememberVoiceInput(BuildConfig.TUNDRA_SERVER_URL, remember(vm) {
                    object : VoiceCallbacks {
                        override fun onStarted(target: VoiceTarget) = vm.onListeningStarted(target)
                        override fun onPartial(text: String) = vm.onPartialTranscript(text)
                        override fun onFinal(text: String) = vm.onFinalTranscript(text)
                        override fun onCancelled() = vm.onListeningCancelled()
                        override fun onError(message: String) = vm.onVoiceError(message)
                    }
                })
                val camera = rememberDeviceCamera(vm::onCameraReady)
                val scope = rememberCoroutineScope()
                val talk = rememberHandsFree(vm)
                PinchToTalk(onStart = talk::begin, onEnd = talk::end)
                // The view model decides; the camera lives here.
                LaunchedEffect(vm, camera) {
                    vm.effects.collect { effect ->
                        when (effect) {
                            Effect.TakePhoto -> {
                                vm.onShutter()
                                vm.onPhotoTaken(camera.takePhoto())
                            }
                            Effect.StartRecording -> {
                                camera.startRecording(withAudio = false)
                                vm.onRecordingStarted()
                            }
                            Effect.StopRecording -> vm.onRecordingStopped(camera.stopRecording())
                            Effect.StartDictation -> talk.startDictation()
                            Effect.StopDictation -> talk.stopDictation()
                        }
                    }
                }
                val actions = remember(vm, voice, camera, talk) {
                    Actions(
                        record = {
                            if (!vm.state.value.isRecording) {
                                camera.startRecording()
                                vm.onRecordingStarted()
                            } else {
                                scope.launch { vm.onRecordingStopped(camera.stopRecording()) }
                            }
                        },
                        photo = {
                            vm.onShutter()
                            scope.launch { vm.onPhotoTaken(camera.takePhoto()) }
                        },
                        note = { voice.toggle(VoiceTarget.Note) },
                        askVoice = { voice.toggle(VoiceTarget.Ask) },
                        ask = vm::ask,
                        send = { vm.ask() },
                        draft = vm::onAskDraftChange,
                        openSource = { s -> s.manualTarget?.let(vm::openManual) },
                        openManual = { t -> vm.openManual(t) },
                        selectDevice = vm::selectDevice,
                        closeManual = vm::closeManual,
                        isManualOpen = { vm.state.value.showManual },
                        showCited = { vm.onUtterance("show me") },
                        talkStart = talk::begin,
                        talkEnd = talk::end,
                        regionSelect = vm::onRegionSelected,
                        regionClose = vm::closeRegion,
                        closeAnswer = vm::closeAnswer,
                        openAnswer = vm::openAnswer,
                    )
                }
                if (LocalSpatialCapabilities.current.isSpatialUiEnabled) {
                    SpatialIslandWorkspace(state, actions) { session?.scene?.requestHomeSpace() }
                } else {
                    HomeSpaceIslandWorkspace(state, actions, canGoFullSpace = session != null) {
                        session?.scene?.requestFullSpace()
                    }
                }
            }
        }
    }
}

/** The hold-to-talk listener behind the bar. Letting the app go to the background drops a hold. */
@Composable
private fun rememberHandsFree(vm: SessionViewModel): HandsFreeListener {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val owner = LocalLifecycleOwner.current
    val listener = remember {
        HandsFreeListener(context.applicationContext, scope, BuildConfig.TUNDRA_SERVER_URL) {
            object : HandsFreeCallbacks {
                override fun onSpeechStart() = vm.onSpeechStart()
                override fun onLevel(level: Float) = vm.onMicLevel(level)
                override fun onPartial(text: String) = vm.onHeard(text)
                override fun onUtterance(text: String) = vm.onUtterance(text)
                override fun onNothingHeard() = vm.onNothingHeard()
                override fun onError(message: String) = vm.onVoiceError(message)
            }
        }
    }
    DisposableEffect(owner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_PAUSE) {
                listener.cancel()
                vm.onNothingHeard()
            }
        }
        owner.lifecycle.addObserver(observer)
        onDispose { owner.lifecycle.removeObserver(observer); listener.release() }
    }
    return listener
}

/** Asks for camera + mic once, then binds the world-facing camera to this activity. */
@Composable
private fun rememberDeviceCamera(onReady: (Boolean) -> Unit): DeviceCamera {
    val context = LocalContext.current
    val owner = LocalLifecycleOwner.current
    val camera = remember { DeviceCamera(context.applicationContext) }
    var granted by remember { mutableStateOf(camera.hasPermission()) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { result ->
        granted = result[Manifest.permission.CAMERA] ?: granted
    }
    LaunchedEffect(Unit) {
        val wanted = arrayOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO, HAND_TRACKING_PERMISSION)
        val missing = wanted.filter { ContextCompat.checkSelfPermission(context, it) != PackageManager.PERMISSION_GRANTED }
        if (missing.isNotEmpty()) launcher.launch(missing.toTypedArray())
    }
    LaunchedEffect(granted) {
        if (granted) onReady(camera.bind(owner))
    }
    return camera
}

/** Everything the engineer can do, wired to the session. The island and its panels call these. */
class Actions(
    val record: () -> Unit,
    val photo: () -> Unit,
    val note: () -> Unit,
    val askVoice: () -> Unit,
    val ask: (String) -> Unit,
    val send: () -> Unit,
    val draft: (String) -> Unit,
    val openSource: (Source) -> Unit,
    val openManual: (ManualTarget?) -> Unit,
    val selectDevice: (Device) -> Unit,
    val closeManual: () -> Unit = {},
    val isManualOpen: () -> Boolean = { false },
    /** Opens the page the latest answer cited. */
    val showCited: () -> Unit = {},
    /** Pinch-and-hold on the bar: talk while held. */
    val talkStart: () -> Unit = {},
    val talkEnd: () -> Unit = {},
    /** Region capture: the box drawn on the frozen view, and closing it. */
    val regionSelect: (List<Float>) -> Unit = {},
    val regionClose: () -> Unit = {},
    val closeAnswer: () -> Unit = {},
    val openAnswer: (Long) -> Unit = {},
)

@Preview(widthDp = 1280, heightDp = 900)
@Composable
private fun HomeSpacePreview() {
    TundraXRTheme {
        HomeSpaceIslandWorkspace(
            SessionState(),
            Actions({}, {}, {}, {}, {}, {}, {}, {}, {}, {}),
            canGoFullSpace = false,
        ) {}
    }
}
