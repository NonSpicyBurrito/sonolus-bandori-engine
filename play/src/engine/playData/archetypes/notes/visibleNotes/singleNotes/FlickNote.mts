import { options } from '../../../../../configuration/options.mjs'
import { buckets } from '../../../../buckets.mjs'
import { effect } from '../../../../effect.mjs'
import { flick } from '../../../../flick.mjs'
import { particle } from '../../../../particle.mjs'
import { scaledScreen } from '../../../../scaledScreen.mjs'
import { getZ, layer, skin } from '../../../../skin.mjs'
import { windows } from '../../../../windows.mjs'
import { isUsed, markAsUsed } from '../../../InputManager.mjs'
import { SingleNote } from './SingleNote.mjs'

export class FlickNote extends SingleNote {
    sprites = {
        note: skin.sprites.flickNote,
        arrow: skin.sprites.flickArrow,
    }

    clips = {
        perfect: effect.clips.flickPerfect,
        great: effect.clips.flickGreat,
        good: effect.clips.flickGood,
    }

    effects = {
        circular: particle.effects.flickNoteCircular,
        linear: particle.effects.flickNoteLinear,
    }

    dualWindows = windows.flickNote

    bucket = buckets.flickNote

    arrow = this.entityMemory({
        layout: Rect,
        animation: Number,
        z: Number,
    })

    activatedTouchId = this.entityMemory(TouchId)

    initialize() {
        super.initialize()

        const w = 0.5 * options.noteSize
        const h = scaledScreen.wToH * options.noteSize

        new Rect({
            l: this.data.lane - w,
            r: this.data.lane + w,
            t: 1 - h,
            b: 1,
        }).copyTo(this.arrow.layout)

        if (options.markerAnimation) this.arrow.animation = 0.25 * h

        this.arrow.z = getZ(layer.note.arrow, this.targetTime, this.data.lane)
    }

    touch() {
        if (options.autoplay) return

        if (time.now < this.inputTime.min) return

        if (!this.activatedTouchId) this.touchActivate()

        if (this.activatedTouchId) this.touchComplete()
    }

    touchActivate() {
        for (const touch of touches) {
            if (!touch.started) continue
            if (!this.hitbox.contains(touch.position)) continue
            if (isUsed(touch)) continue

            markAsUsed(touch)

            this.activate(touch)
            return
        }
    }

    activate(touch: Touch) {
        this.activatedTouchId = touch.id
    }

    touchComplete() {
        for (const touch of touches) {
            if (touch.id !== this.activatedTouchId) continue

            const d = touch.position.sub(touch.startPosition).length

            if (d >= 0.04 * flick.distance) {
                this.complete(touch)
            } else if (touch.ended) {
                this.despawn = true
            }
            return
        }
    }

    complete(touch: Touch) {
        this.result.judgment = input.judge(touch.startTime, this.targetTime, this.windows)
        this.result.accuracy = touch.startTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playHitEffects()

        this.despawn = true
    }

    render() {
        super.render()

        if (options.markerAnimation) {
            const y = Math.lerp(
                -this.arrow.animation,
                this.arrow.animation,
                Math.frac((time.now - this.targetTime) * 3 + 0.5),
            )

            this.sprites.arrow.draw(this.arrow.layout.sub({ x: 0, y }).mul(this.y), this.arrow.z, 1)
        } else {
            this.sprites.arrow.draw(this.arrow.layout.mul(this.y), this.arrow.z, 1)
        }
    }
}
