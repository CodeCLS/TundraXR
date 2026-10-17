package com.tundra.tundraxr

import android.Manifest
import android.os.Bundle
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.ui.draw.clip
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.graphics.Color
import androidx.xr.compose.unit.DpVolumeSize
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.unit.DpSize
import com.tundra.tundraxr.ui.components.AdaptivePanel
import com.tundra.tundraxr.ui.components.Scaled
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.tundra.tundraxr.capture.DeviceCamera
import kotlinx.coroutines.launch
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.xr.compose.platform.LocalSession
import androidx.xr.compose.platform.LocalSpatialCapabilities
import androidx.xr.compose.spatial.ContentEdge
import androidx.xr.compose.spatial.Orbiter
import androidx.xr.compose.spatial.OrbiterAnchorPoint
import androidx.xr.compose.spatial.Subspace
import androidx.xr.compose.subspace.SpatialCurvedRow
import androidx.xr.compose.subspace.SpatialPanel
import androidx.xr.compose.subspace.layout.SpatialArrangement
import androidx.xr.compose.subspace.layout.SpatialRoundedCornerShape
import androidx.xr.compose.subspace.layout.SubspaceModifier
import androidx.xr.compose.subspace.layout.height
import androidx.xr.compose.subspace.layout.movable
import androidx.xr.compose.subspace.layout.resizable
import androidx.xr.compose.subspace.layout.width
import androidx.xr.compose.unit.DpVolumeOffset
import androidx.xr.scenecore.scene
import com.tundra.tundraxr.data.Device
import com.tundra.tundraxr.data.Source
import com.tundra.tundraxr.ui.ask.AskPanel
import com.tundra.tundraxr.ui.capture.CapturePanel
import com.tundra.tundraxr.ui.capture.ControlBar
import com.tundra.tundraxr.ui.components.VerticalHairline
import com.tundra.tundraxr.ui.manual.ManualPanel
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.TundraXRTheme
import com.tundra.tundraxr.voice.VoiceCallbacks
import com.tundra.tundraxr.voice.rememberVoiceInput

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
                        toggleAsk = vm::toggleAsk,
                        toggleManual = vm::toggleManual,
                        openSource = { s -> s.manualTarget?.let(vm::openManual) },
                        selectDevice = vm::selectDevice,
                    )
                }
                if (LocalSpatialCapabilities.current.isSpatialUiEnabled) {
                    Subspace {
                        SpatialWorkspace(state, actions) { session?.scene?.requestHomeSpace() }
                    }
                } else {
                    HomeSpaceWorkspace(state, actions, canGoFullSpace = session != null) {
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

class Actions(
    val record: () -> Unit,
    val photo: () -> Unit,
    val note: () -> Unit,
    val askVoice: () -> Unit,
    val ask: (String) -> Unit,
    val send: () -> Unit,
    val draft: (String) -> Unit,
    val toggleAsk: () -> Unit,
    val toggleManual: () -> Unit,
    val openSource: (Source) -> Unit,
    val selectDevice: (Device) -> Unit,
)

private val panelShape = SpatialRoundedCornerShape(CornerSize(32.dp))

// Panels adapt to any size in between; these just stop them becoming unusable.
private val PanelMin = DpVolumeSize(320.dp, 300.dp, 0.dp)
private val PanelMax = DpVolumeSize(2600.dp, 1800.dp, 0.dp)

/**
 * Full Space: three panels on a gentle curve around the engineer.
 * Ask on the left, the capture session in front, the manual on the right, so the
 * device itself stays visible in passthrough below and between them.
 */
@Composable
fun SpatialWorkspace(state: SessionState, actions: Actions, onRequestHomeSpace: () -> Unit) {
    // The control bar orbits the capture panel; when that panel is resized big, the bar grows with it.
    var captureScale by remember { mutableFloatStateOf(1f) }
    SpatialCurvedRow(
        horizontalArrangement = SpatialArrangement.spacedBy(40.dp),
        curveRadius = 1400.dp,
    ) {
        if (state.showAsk) {
            SpatialPanel(SubspaceModifier.width(560.dp).height(760.dp).movable().resizable(minimumSize = PanelMin, maximumSize = PanelMax), shape = panelShape) {
                AskPanel(
                    state,
                    onDraftChange = actions.draft,
                    onSend = actions.send,
                    onAsk = actions.ask,
                    onMic = actions.askVoice,
                    onSource = actions.openSource,
                    onClose = actions.toggleAsk,
                )
            }
        }
        SpatialPanel(SubspaceModifier.width(880.dp).height(760.dp).movable().resizable(minimumSize = PanelMin, maximumSize = PanelMax), shape = panelShape) {
            CapturePanel(state, actions.selectDevice, onScale = { captureScale = it })
            Orbiter(ContentEdge.Bottom, offset = 24.dp, alignment = Alignment.CenterHorizontally) {
                Scaled(captureScale) {
                    ControlBar(state, actions.record, actions.photo, actions.note, actions.toggleAsk, actions.toggleManual)
                }
            }
            Orbiter(
                anchorPoint = OrbiterAnchorPoint.TopEnd,
                offset = DpVolumeOffset(y = 20.dp),
                shape = SpatialRoundedCornerShape(CornerSize(28.dp)),
            ) {
                FilledTonalIconButton(
                    onClick = onRequestHomeSpace,
                    modifier = Modifier.size(56.dp),
                    colors = IconButtonDefaults.filledTonalIconButtonColors(containerColor = Tundra.colors.raised),
                ) {
                    Icon(painterResource(R.drawable.ic_home_space_switch), stringResource(R.string.switch_to_home_space))
                }
            }
        }
        if (state.showManual) {
            SpatialPanel(SubspaceModifier.width(640.dp).height(760.dp).movable().resizable(minimumSize = PanelMin, maximumSize = PanelMax), shape = panelShape) {
                ManualPanel(state.manual, state.manualTarget, onClose = actions.toggleManual)
            }
        }
    }
}

private enum class Pane(val label: String) { Capture("Capture"), Ask("Ask"), Manual("Manual") }

/**
 * Home Space: one resizable window, so the layout follows its width.
 * Wide → all three side by side; medium → capture plus the active side panel; narrow → tabs.
 */
@Composable
fun HomeSpaceWorkspace(state: SessionState, actions: Actions, canGoFullSpace: Boolean, onRequestFullSpace: () -> Unit) {
    val c = Tundra.colors
    // The whole window scales up when it's very large (control bar included); breakpoints below
    // then work on the scaled size, so the panels don't scale a second time.
    AdaptivePanel(DpSize(1600.dp, 1000.dp), Modifier.fillMaxSize().background(c.paper).safeDrawingPadding(), allowShrink = false) { window ->
        val windowWidth = window.width
        val windowHeight = window.height
        val columns = when {
            windowWidth >= 1400.dp -> 3
            windowWidth >= 880.dp -> 2
            else -> 1
        }
        var pane by remember { mutableStateOf(Pane.Capture) }
        // When the brain points into the manual, show it, even in a single-pane window.
        LaunchedEffect(state.manualTarget) { if (state.manualTarget != null) pane = Pane.Manual }

        val ask: @Composable (Modifier) -> Unit = { m ->
            AskPanel(state, actions.draft, actions.send, actions.ask, actions.askVoice, actions.openSource, onClose = null, modifier = m)
        }
        val capture: @Composable (Modifier) -> Unit = { m -> CapturePanel(state, actions.selectDevice, m) }
        val manual: @Composable (Modifier) -> Unit = { m -> ManualPanel(state.manual, state.manualTarget, onClose = null, modifier = m) }

        Column(Modifier.fillMaxSize()) {
            if (columns == 1) PaneTabs(pane, slim = windowHeight < 420.dp) { pane = it }
            Row(Modifier.weight(1f).fillMaxWidth()) {
                when (columns) {
                    3 -> {
                        if (state.showAsk) {
                            ask(Modifier.weight(0.28f).fillMaxHeight())
                            VerticalHairline(Modifier.fillMaxHeight())
                        }
                        capture(Modifier.weight(0.42f).fillMaxHeight())
                        if (state.showManual) {
                            VerticalHairline(Modifier.fillMaxHeight())
                            manual(Modifier.weight(0.3f).fillMaxHeight())
                        }
                    }
                    2 -> {
                        capture(Modifier.weight(0.55f).fillMaxHeight())
                        val side = when {
                            state.showManual -> manual
                            state.showAsk -> ask
                            else -> null
                        }
                        if (side != null) {
                            VerticalHairline(Modifier.fillMaxHeight())
                            side(Modifier.weight(0.45f).fillMaxHeight())
                        }
                    }
                    else -> when (pane) {
                        Pane.Capture -> capture(Modifier.fillMaxSize())
                        Pane.Ask -> ask(Modifier.fillMaxSize())
                        Pane.Manual -> manual(Modifier.fillMaxSize())
                    }
                }
            }
            val compactBar = windowWidth < 640.dp || windowHeight < 560.dp
            Row(
                Modifier.fillMaxWidth().padding(vertical = if (windowHeight < 420.dp) 4.dp else if (compactBar) 8.dp else 16.dp, horizontal = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
            ) {
                ControlBar(
                    state, actions.record, actions.photo, actions.note,
                    // Single pane: Ask/Manual switch tabs instead of opening side panels.
                    onAsk = { if (columns == 1) pane = if (pane == Pane.Ask) Pane.Capture else Pane.Ask else actions.toggleAsk() },
                    onManual = { if (columns == 1) pane = if (pane == Pane.Manual) Pane.Capture else Pane.Manual else actions.toggleManual() },
                    compact = compactBar,
                    tiny = windowHeight < 420.dp,
                )
                if (canGoFullSpace) {
                    IconButton(onClick = onRequestFullSpace, modifier = Modifier.padding(start = 8.dp)) {
                        Icon(painterResource(R.drawable.ic_full_space_switch), stringResource(R.string.switch_to_full_space), tint = c.ink)
                    }
                }
            }
        }
    }
}

/** Segmented Capture / Ask / Manual switch for narrow windows. */
@Composable
private fun PaneTabs(selected: Pane, slim: Boolean, onSelect: (Pane) -> Unit) {
    val c = Tundra.colors
    Row(
        Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = if (slim) 4.dp else 10.dp).clip(CircleShape).background(c.muted).padding(if (slim) 2.dp else 4.dp),
    ) {
        Pane.entries.forEach { p ->
            val on = p == selected
            Box(
                Modifier.weight(1f).heightIn(min = if (slim) 36.dp else 44.dp).clip(CircleShape).background(if (on) c.raised else Color.Transparent).clickable { onSelect(p) },
                contentAlignment = Alignment.Center,
            ) {
                Text(p.label, style = MaterialTheme.typography.labelLarge, color = if (on) c.ink else c.inkMuted)
            }
        }
    }
}

@Preview(widthDp = 1600, heightDp = 900)
@Composable
private fun HomeSpacePreview() {
    TundraXRTheme {
        HomeSpaceWorkspace(
            SessionState(showManual = true),
            Actions({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}),
            canGoFullSpace = false,
        ) {}
    }
}
