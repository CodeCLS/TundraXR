package com.tundra.tundraxr.ui.island

import android.util.Log
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.xr.compose.spatial.ExperimentalFollowingSubspaceApi
import androidx.xr.compose.spatial.FollowingSubspace
import androidx.xr.compose.subspace.FollowBehavior
import androidx.xr.compose.subspace.FollowTarget
import androidx.xr.compose.subspace.TrackedDimensions
import androidx.xr.runtime.Config
import androidx.xr.runtime.DeviceTrackingMode
import androidx.xr.runtime.SessionConfigureSuccess
import androidx.compose.foundation.background
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.Column
import com.tundra.tundraxr.ui.theme.Motion
import kotlinx.coroutines.delay
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.xr.compose.subspace.layout.MovePolicy
import androidx.xr.compose.subspace.layout.ResizePolicy
import androidx.xr.compose.subspace.layout.rotate
import androidx.xr.runtime.math.Vector3
import com.tundra.tundraxr.R
import com.tundra.tundraxr.ui.components.Scaled
import kotlin.math.atan2
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.xr.compose.platform.LocalSession
import androidx.xr.compose.spatial.Subspace
import androidx.xr.compose.subspace.SpatialPanel
import androidx.xr.compose.subspace.SpatialBox
import androidx.xr.compose.subspace.layout.SpatialRoundedCornerShape
import androidx.xr.compose.subspace.layout.SubspaceModifier
import androidx.xr.compose.subspace.layout.height
import androidx.xr.compose.subspace.layout.movable
import androidx.xr.compose.subspace.layout.offset
import androidx.xr.compose.subspace.layout.resizable
import androidx.xr.compose.subspace.layout.width
import androidx.xr.compose.unit.DpVolumeSize
import androidx.xr.scenecore.SpatialEnvironment
import androidx.xr.scenecore.scene
import com.tundra.tundraxr.Actions
import com.tundra.tundraxr.BuildConfig
import com.tundra.tundraxr.SessionState
import com.tundra.tundraxr.ui.bar.VoiceBar
import com.tundra.tundraxr.ui.components.DotPattern
import com.tundra.tundraxr.ui.manual.ManualPanel
import com.tundra.tundraxr.ui.region.RegionPanel
import com.tundra.tundraxr.ui.answer.AnswerPanel
import com.tundra.tundraxr.ui.theme.Tundra
import com.tundra.tundraxr.ui.theme.XrTokens

// Focused panels adapt to any size in between; these just stop them becoming unusable.
private val FocusedMin = DpVolumeSize(320.dp, 300.dp, 0.dp)
private val FocusedMax = DpVolumeSize(2600.dp, 1800.dp, 0.dp)

/**
 * Where the island is (open or not) and what the focused panel shows. UI state only: it lives
 * here, apart from the session, and survives rotation. Closing the focused panel returns to the
 * open island.
 */
private class IslandUi(val expanded: MutableState<Boolean>, val focused: MutableState<FocusedContent?>) {
    fun open(content: FocusedContent) {
        focused.value = content
    }

    fun toggle(content: FocusedContent) {
        focused.value = if (focused.value == content) null else content
    }

    fun closeFocused() {
        focused.value = null
        expanded.value = true
    }
}

@Composable
private fun rememberIslandUi() = IslandUi(
    rememberSaveable { mutableStateOf(false) },
    rememberSaveable(stateSaver = FocusedContent.Saver) { mutableStateOf<FocusedContent?>(null) },
)

/** The island's callbacks, each onto an existing [Actions] entry or a change of UI state. */
private fun islandActions(ui: IslandUi, actions: Actions, switchSpace: (() -> Unit)?, switchToFull: Boolean) = IslandActions(
    expand = { ui.expanded.value = true },
    collapse = { ui.expanded.value = false },
    askVoice = actions.askVoice,
    photo = actions.photo,
    record = actions.record,
    chat = { ui.toggle(FocusedContent.Chat) },
    voiceNote = actions.note,
    manual = { if (actions.isManualOpen()) actions.closeManual() else actions.openManual(null) },
    draft = actions.draft,
    send = actions.send,
    ask = actions.ask,
    source = { s ->
        // A cited page opens only when the engineer asks for it; answers never pop the manual up.
        if (s.manualTarget != null) {
            actions.openSource(s)
        }
    },
    openGuidance = { g ->
        actions.openManual(g.target)
    },
    openImage = { img -> ui.open(FocusedContent.Picture(img.file, img.label)) },
    openChat = { ui.open(FocusedContent.Chat) },
    openSession = { ui.open(FocusedContent.Session) },
    selectDevice = actions.selectDevice,
    switchSpace = switchSpace,
    switchToFull = switchToFull,
)

/**
 * Full Space: the engineer sees the real room (passthrough). The hands-free bar floats a little
 * below eye level and stays out of the way; the manual opens beside it when asked for, and
 * the other panels open from the full controls (tap the bar).
 */
@OptIn(ExperimentalFollowingSubspaceApi::class)
@Composable
fun SpatialIslandWorkspace(state: SessionState, actions: Actions, onRequestHomeSpace: () -> Unit) {
    // Full Space otherwise shows the system's virtual environment; this is AR, so ask for the
    // real room. On leaving, hand passthrough back to the system.
    val session = LocalSession.current
    DisposableEffect(session) {
        val environment = session?.scene?.spatialEnvironment
        environment?.preferredPassthroughOpacity = 1f
        onDispose { environment?.preferredPassthroughOpacity = SpatialEnvironment.NO_PASSTHROUGH_OPACITY_PREFERENCE }
    }
    val ui = rememberIslandUi()
    val model = state.toIslandModel(demo = BuildConfig.TUNDRA_DEMO)
    val islandActions = islandActions(ui, actions, onRequestHomeSpace, switchToFull = false)
    // The island rides along with the engineer's head, near the top of their view; it needs
    // the headset's position, so device tracking is switched on first.
    var tracking by remember { mutableStateOf(false) }
    LaunchedEffect(session) {
        val s = session ?: return@LaunchedEffect
        val result = runCatching { s.configure(Config.Builder(s.config).setDeviceTracking(DeviceTrackingMode.LAST_KNOWN).build()) }
        Log.i("TundraIsland", "device tracking: ${result.getOrNull() ?: result.exceptionOrNull()}")
        tracking = result.getOrNull() is SessionConfigureSuccess
    }
    val island: @Composable () -> Unit = {
        if (ui.expanded.value) {
            RepairDynamicIsland(model, PanelMode.Expanded, islandActions, photoFlash = state.photoFlash)
        } else {
            VoiceBar(state, onTap = { ui.expanded.value = true }, onCitation = { actions.showCited() }, onHoldStart = actions.talkStart, onHoldEnd = actions.talkEnd)
        }
    }
    if (tracking && session != null) {
        // Auto: the island follows the head. Grabbing it to move or resize pins it where it is;
        // the Auto button (shown only then) puts it back, at its normal size.
        var pinned by rememberSaveable { mutableStateOf(false) }
        var placement by rememberSaveable { mutableIntStateOf(0) }
        // Counts move/resize events; the Auto button shows while they keep coming and a moment after.
        var handled by remember { mutableIntStateOf(0) }
        var recentlyHandled by remember { mutableStateOf(false) }
        LaunchedEffect(handled) {
            if (handled == 0) return@LaunchedEffect
            recentlyHandled = true
            delay(AutoButtonLingerMs)
            recentlyHandled = false
        }
        FollowingSubspace(
            target = FollowTarget.ArDevice(session),
            behavior = if (pinned) FollowBehavior.Static else FollowBehavior.Soft(IslandFollowMs),
            // Follow position, turning and looking up/down (so it's always at the top of the view),
            // but never roll with a tilted head.
            dimensions = TrackedDimensions(true, true, true, true, true, false),
        ) {
            key(placement) {
                SpatialPanel(
                    SubspaceModifier
                        .offset(y = FollowPanelY, z = -IslandDistance)
                        // Face the eyes rather than straight ahead, so it doesn't look tilted.
                        .rotate(Vector3(1f, 0f, 0f), IslandPitchDeg)
                        .width(BarPanelWidth).height(BarPanelHeight)
                        .movable(true, MovePolicy.default(false) { pinned = true; handled++ })
                        .resizable(true, IslandMinSize, IslandMaxSize, false, ResizePolicy.default { pinned = true; handled++ }),
                ) {
                    ScaledIsland {
                        val hover = remember { MutableInteractionSource() }
                        val hovered by hover.collectIsHoveredAsState()
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.TopCenter) {
                            // The Auto button hangs below the island in the same column, so it moves down
                            // as the island grows and can never cover it. It shows while the island is
                            // being moved or resized, briefly after, and again when looked at while pinned.
                            Column(Modifier.hoverable(hover), horizontalAlignment = Alignment.CenterHorizontally) {
                                island()
                                AnimatedVisibility(
                                    pinned && (recentlyHandled || hovered),
                                    enter = fadeIn(tween(Motion.Base)) + expandVertically(tween(Motion.Base), expandFrom = Alignment.Top),
                                    exit = fadeOut(tween(Motion.Base)) + shrinkVertically(tween(Motion.Base), shrinkTowards = Alignment.Top),
                                ) {
                                    AutoButton(onClick = { pinned = false; recentlyHandled = false; placement++ }, modifier = Modifier.padding(top = 10.dp))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    Subspace {
        SpatialBox {
            if (!tracking) {
                SpatialPanel(SubspaceModifier.offset(y = BarPanelY).width(BarPanelWidth).height(BarPanelHeight).movable()) {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.TopCenter) { island() }
                }
            }
            if (state.showManual) {
                SpatialPanel(
                    SubspaceModifier.offset(x = ManualOffsetX, y = ManualOffsetY).width(640.dp).height(780.dp)
                        .movable().resizable(minimumSize = FocusedMin, maximumSize = FocusedMax),
                    shape = SpatialRoundedCornerShape(CornerSize(XrTokens.FocusedPanelRadius)),
                ) {
                    ManualPanel(state.manual, state.manualTarget, onClose = actions.closeManual)
                }
            }
            val answerId = state.answerPanel
            val reply = state.chat.firstOrNull { it.id == answerId }
            if (reply != null) {
                // Left of the island, where the manual (right) doesn't go.
                SpatialPanel(
                    SubspaceModifier.offset(x = -ManualOffsetX, y = ManualOffsetY).width(820.dp).height(860.dp)
                        .movable().resizable(minimumSize = FocusedMin, maximumSize = FocusedMax),
                    shape = SpatialRoundedCornerShape(CornerSize(XrTokens.FocusedPanelRadius)),
                ) {
                    AnswerPanel(
                        question = state.chat.lastOrNull { it.fromUser && it.id < reply.id }?.text,
                        reply = reply,
                        onAsk = actions.ask,
                        onClose = actions.closeAnswer,
                    )
                }
            }
            val region = state.region
            if (region != null) {
                // Straight ahead and large, so the device can be boxed precisely.
                SpatialPanel(
                    SubspaceModifier.offset(y = (-40).dp, z = 120.dp).width(1180.dp).height(720.dp)
                        .movable().resizable(minimumSize = FocusedMin, maximumSize = FocusedMax),
                    shape = SpatialRoundedCornerShape(CornerSize(XrTokens.FocusedPanelRadius)),
                ) {
                    RegionPanel(region, onSelect = actions.regionSelect, onClose = actions.regionClose)
                }
            }
            val focused = ui.focused.value?.takeUnless { it == FocusedContent.Manual }
            if (focused != null) {
                SpatialPanel(
                    SubspaceModifier.offset(x = -ManualOffsetX, y = ManualOffsetY).width(760.dp).height(760.dp)
                        .movable().resizable(minimumSize = FocusedMin, maximumSize = FocusedMax),
                    shape = SpatialRoundedCornerShape(CornerSize(XrTokens.FocusedPanelRadius)),
                ) {
                    FocusedPanel(focused, state, actions, onClose = ui::closeFocused)
                }
            }
        }
    }
}

/** Grows the island with its panel when the engineer makes the panel bigger. */
@Composable
private fun ScaledIsland(content: @Composable () -> Unit) {
    BoxWithConstraints(Modifier.fillMaxSize()) {
        val scale = (maxWidth / BarPanelWidth).coerceIn(0.8f, 2.6f)
        Scaled(scale) { content() }
    }
}

/** Only shown when the island has been moved or resized: puts it back on auto-follow. */
@Composable
private fun AutoButton(onClick: () -> Unit, modifier: Modifier = Modifier) {
    Box(modifier) {
        Row(
            Modifier.height(44.dp).clip(RoundedCornerShape(22.dp)).background(Color(0xF22A2925))
                .border(1.dp, Color(0x33FAF7EC), RoundedCornerShape(22.dp))
                .clickable(onClick = onClick).padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(painterResource(R.drawable.ic_scan), null, Modifier.size(18.dp), tint = Color(0xFFA9B9E0))
            Text("Auto", style = MaterialTheme.typography.labelLarge, color = Color(0xFFFAF7EC), modifier = Modifier.padding(start = 8.dp))
        }
    }
}

/** How far in front of the eyes the island floats, and how quickly it catches up with a turn. */
private val IslandDistance = 1500.dp
private const val IslandFollowMs = 350
/** How long the Auto button stays after the last move or resize. */
private const val AutoButtonLingerMs = 3000L
/** Island top edge above the eye line when following the head (about 24° up at that distance). */
private val FollowIslandTopY = 680.dp

private val BarPanelWidth = 600.dp
private val BarPanelHeight = 520.dp
private val FollowPanelY = FollowIslandTopY - BarPanelHeight / 2
/** Tilt toward the eyes: the angle of the island's centre above the eye line. */
private val IslandPitchDeg = Math.toDegrees(atan2((FollowIslandTopY - 30.dp).value.toDouble(), IslandDistance.value.toDouble())).toFloat()
private val IslandMinSize = DpVolumeSize(360.dp, 200.dp, 0.dp)
private val IslandMaxSize = DpVolumeSize(1560.dp, 1400.dp, 0.dp)
/** The island sits near the top of the view, like a status island; the panel hangs below it. */
private val IslandTopY = 240.dp
private val BarPanelY = IslandTopY - BarPanelHeight / 2
private val ManualOffsetX = 660.dp
private val ManualOffsetY = (-60).dp

/**
 * Home Space: one window. The manual (when open) fills it, and the hands-free bar sits at the
 * bottom centre, like it does under the engineer's eye line in Full Space.
 */
@Composable
fun HomeSpaceIslandWorkspace(state: SessionState, actions: Actions, canGoFullSpace: Boolean, onRequestFullSpace: () -> Unit) {
    val c = Tundra.colors
    val ui = rememberIslandUi()
    val model = state.toIslandModel(demo = BuildConfig.TUNDRA_DEMO)
    val islandActions = islandActions(ui, actions, onRequestFullSpace.takeIf { canGoFullSpace }, switchToFull = true)
    val focused = ui.focused.value?.takeUnless { it == FocusedContent.Manual }
    Box(Modifier.fillMaxSize().background(c.paper).safeDrawingPadding()) {
        DotPattern()
        when {
            focused != null -> FocusedPanel(
                focused, state, actions, onClose = ui::closeFocused,
                modifier = Modifier.fillMaxSize().padding(start = 16.dp, end = 16.dp, bottom = 16.dp, top = 84.dp).clip(RoundedCornerShape(XrTokens.FocusedPanelRadius)),
            )
            state.answerPanel != null && state.chat.any { it.id == state.answerPanel } -> AnswerPanel(
                question = state.chat.lastOrNull { it.fromUser && it.id < state.answerPanel }?.text,
                reply = state.chat.first { it.id == state.answerPanel },
                onAsk = actions.ask, onClose = actions.closeAnswer,
                modifier = Modifier.fillMaxSize().padding(start = 16.dp, end = 16.dp, bottom = 16.dp, top = 84.dp),
            )
            state.region != null -> RegionPanel(
                state.region, onSelect = actions.regionSelect, onClose = actions.regionClose,
                modifier = Modifier.fillMaxSize().padding(start = 16.dp, end = 16.dp, bottom = 16.dp, top = 84.dp),
            )
            state.showManual -> ManualPanel(
                state.manual, state.manualTarget, onClose = actions.closeManual,
                modifier = Modifier.fillMaxSize().padding(start = 16.dp, end = 16.dp, bottom = 16.dp, top = 84.dp).clip(RoundedCornerShape(XrTokens.FocusedPanelRadius)),
            )
        }
        Box(Modifier.align(Alignment.TopCenter).padding(top = 16.dp)) {
            if (ui.expanded.value) {
                Box(Modifier.verticalScroll(rememberScrollState())) {
                    RepairDynamicIsland(model, PanelMode.Expanded, islandActions, photoFlash = state.photoFlash)
                }
            } else {
                VoiceBar(state, onTap = { ui.expanded.value = true }, onCitation = { actions.showCited() }, onHoldStart = actions.talkStart, onHoldEnd = actions.talkEnd)
            }
        }
    }
}
