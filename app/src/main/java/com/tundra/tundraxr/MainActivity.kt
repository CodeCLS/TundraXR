package com.tundra.tundraxr

import android.Manifest
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
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
                val actions = remember(vm, voice, camera) {
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

/** Asks for camera + mic once, then binds the world-facing camera to this activity. */
@Composable
private fun rememberDeviceCamera(onReady: (Boolean) -> Unit): DeviceCamera {
    val context = LocalContext.current
    val owner = LocalLifecycleOwner.current
    val camera = remember { DeviceCamera(context.applicationContext) }
    var granted by remember { mutableStateOf(camera.hasPermission()) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { result ->
        granted = result[Manifest.permission.CAMERA] == true
    }
    LaunchedEffect(Unit) {
        if (!granted) launcher.launch(arrayOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO))
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
