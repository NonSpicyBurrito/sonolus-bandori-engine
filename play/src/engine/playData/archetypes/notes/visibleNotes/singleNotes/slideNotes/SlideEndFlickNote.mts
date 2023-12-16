import { options } from '../../../../../../configuration/options.mjs'
import { buckets } from '../../../../../buckets.mjs'
import { effect } from '../../../../../effect.mjs'
import { flick } from '../../../../../flick.mjs'
import { particle } from '../../../../../particle.mjs'
import { scaledScreen } from '../../../../../scaledScreen.mjs'
import { getZ, layer, skin } from '../../../../../skin.mjs'
import { windows } from '../../../../../windows.mjs'
import { queueHold } from '../../../../HoldManager.mjs'
import { SlideNote } from './SlideNote.mjs'

export class SlideEndFlickNote extends SlideNote {
    slideEndFlickData = this.defineData({
        long: { name: 'long', type: Boolean },
    })

    sprites = {
        note: skin.sprites.flickEndNote,
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

    dualWindows = windows.slideEndFlickNote

    bucket = buckets.slideEndFlickNote

    arrow = this.entityMemory({
        layout: Rect,
        animation: Number,
        z: Number,
    })

    activatedTouch = this.entityMemory({
        id: TouchId,
        position: Vec,
    })

    preprocess() {
        super.preprocess()

        const minPrevInputTime =
            bpmChanges.at(this.prevData.beat).time + windows.minGood + input.offset

        this.spawnTime = Math.min(this.spawnTime, minPrevInputTime)
    }

    initialize() {
        super.initialize()

        if (!this.slideEndFlickData.long) this.inputTime.min = this.targetTime + input.offset

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
        const id = this.prevSharedMemory.activatedTouchId

        if (!this.activatedTouch.id) this.touchActivate(id)

        if (this.activatedTouch.id) this.touchComplete()
    }

    touchActivate(id: TouchId) {
        if (id) {
            for (const touch of touches) {
                if (touch.id !== id) continue

                if (!touch.ended) queueHold(this.slideData.firstRef)

                if (time.now >= this.inputTime.min && this.hitbox.contains(touch.position)) {
                    this.activate(touch)
                } else if (touch.ended) {
                    this.despawn = true
                }
                return
            }

            this.despawn = true
            return
        }

        if (this.prevInfo.state !== EntityState.Despawned) return
        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            if (!this.hitbox.contains(touch.position)) continue

            this.activate(touch)
            return
        }
    }

    activate(touch: Touch) {
        this.activatedTouch.id = touch.id
        this.activatedTouch.position.x = touch.position.x
        this.activatedTouch.position.y = touch.position.y
    }

    touchComplete() {
        for (const touch of touches) {
            if (touch.id !== this.activatedTouch.id) continue

            const d = touch.position.sub(this.activatedTouch.position).length

            if (d >= 0.04 * flick.distance) {
                this.complete(touch)
            } else if (touch.ended) {
                this.despawn = true
            }
            return
        }
    }

    complete(touch: Touch) {
        this.result.judgment = input.judge(touch.time, this.targetTime, this.windows)
        this.result.accuracy = touch.time - this.targetTime

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
