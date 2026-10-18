package com.tundra.tundraxr.voice

import android.content.pm.PackageManager
import android.os.SystemClock
import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.xr.arcore.Hand
import androidx.xr.arcore.HandJointType
import androidx.xr.arcore.TrackingState
import androidx.xr.compose.platform.LocalSession
import androidx.xr.runtime.Config
import androidx.xr.runtime.HandTrackingMode
import androidx.xr.runtime.math.Vector3
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.combine

const val HAND_TRACKING_PERMISSION = "android.permission.HAND_TRACKING"
private const val TAG = "TundraPinch"

/** Thumb and middle tips closer than this are pinched; further than [OPEN_M] are open again. */
private const val PINCHED_M = 0.015f
private const val OPEN_M = 0.03f
/** The index finger has to stay clear of the thumb, so the system's own pinch never opens the mic. */
private const val INDEX_CLEAR_M = 0.025f
/** A pinch has to be held this long to count, so quick UI pinches don't open the mic. */
private const val HOLD_MS = 250L

/**
 * Hold thumb and middle finger together (either hand, anywhere) to talk; open them to finish.
 * Thumb + index is the system's select pinch, so it's left alone: the index has to be clear of
 * the thumb. Uses the headset's hand tracking, so it works without looking at the bar.
 */
@Composable
fun PinchToTalk(onStart: () -> Unit, onEnd: () -> Unit) {
    val session = LocalSession.current ?: return
    val context = LocalContext.current
    val start by rememberUpdatedState(onStart)
    val end by rememberUpdatedState(onEnd)
    var granted by remember { mutableStateOf(false) }
    // The permission is asked for with the camera and mic at launch; wait for it.
    LaunchedEffect(Unit) {
        while (ContextCompat.checkSelfPermission(context, HAND_TRACKING_PERMISSION) != PackageManager.PERMISSION_GRANTED) delay(1000)
        granted = true
    }
    LaunchedEffect(session, granted) {
        if (!granted) return@LaunchedEffect
        val configured = runCatching {
            session.configure(Config.Builder(session.config).setHandTracking(HandTrackingMode.BOTH).build())
        }
        Log.i(TAG, "hand tracking: ${configured.getOrNull() ?: configured.exceptionOrNull()}")
        if (configured.isFailure) return@LaunchedEffect
        val hands = listOfNotNull(Hand.left(session), Hand.right(session))
        if (hands.isEmpty()) return@LaunchedEffect Unit.also { Log.w(TAG, "no hands available") }
        val pinched = BooleanArray(hands.size)
        var since = 0L
        var active = false
        combine(hands.map { it.state }) { it.toList() }.collect { states ->
            states.forEachIndexed { i, s ->
                val d = if (s.trackingState == TrackingState.TRACKING) {
                    val thumb = s.handJoints[HandJointType.THUMB_TIP]?.translation
                    val middle = s.handJoints[HandJointType.MIDDLE_TIP]?.translation
                    val index = s.handJoints[HandJointType.INDEX_TIP]?.translation
                    when {
                        thumb == null || middle == null || index == null -> null
                        // Index on the thumb too: a system pinch (or a fist), not ours.
                        !pinched[i] && Vector3.distance(thumb, index) < INDEX_CLEAR_M -> null
                        else -> Vector3.distance(thumb, middle)
                    }
                } else null
                pinched[i] = when {
                    d == null -> false
                    d < PINCHED_M -> true
                    d > OPEN_M -> false
                    else -> pinched[i]
                }
            }
            val now = SystemClock.elapsedRealtime()
            val any = pinched.any { it }
            if (!any) since = 0L else if (since == 0L) since = now
            if (any && !active && now - since >= HOLD_MS) {
                active = true
                Log.i(TAG, "pinch hold: start")
                start()
            } else if (!any && active) {
                active = false
                Log.i(TAG, "pinch hold: end")
                end()
            }
        }
    }
}
