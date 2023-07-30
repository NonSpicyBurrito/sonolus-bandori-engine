import { options } from '../../../../../../configuration/options.mjs'
import { buckets } from '../../../../../buckets.mjs'
import { effect } from '../../../../../effect.mjs'
import { particle } from '../../../../../particle.mjs'
import { skin } from '../../../../../skin.mjs'
import { isUsed, markAsUsed } from '../../../../InputManager.mjs'
import { SlideConnector } from '../../../../sliderConnectors/SlideConnector.mjs'
import { windows } from '../../../../windows.mjs'
import { SlideNote } from './SlideNote.mjs'

export class SlideStartNote extends SlideNote {
    sprites = {
        note: skin.sprites.slideNote,
    }

    clips = {
        perfect: effect.clips.tapPerfect,
        great: effect.clips.tapGreat,
        good: effect.clips.tapGood,
    }

    effects = {
        circular: particle.effects.tapNoteCircular,
        linear: particle.effects.tapNoteLinear,
    }

    dualWindows = windows.slideStartNote

    bucket = buckets.slideStartNote

    updateSequential() {
        if (!options.autoplay) return

        if (time.now < this.targetTime) return

        if (SlideConnector.shouldScheduleCircularEffect)
            this.sharedMemory.effectInstanceIds.circular ||= SlideConnector.spawnCircularEffect(
                this.data.lane,
            )

        if (SlideConnector.shouldScheduleLinearEffect)
            this.sharedMemory.effectInstanceIds.linear ||= SlideConnector.spawnLinearEffect(
                this.data.lane,
            )
    }

    touch() {
        if (options.autoplay) return

        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            if (!touch.started) continue
            if (!this.hitbox.contains(touch.position)) continue
            if (isUsed(touch)) continue

            this.complete(touch)
            this.startSlideEffects()
            return
        }
    }

    complete(touch: Touch) {
        markAsUsed(touch)
        this.sharedMemory.activatedTouchId = touch.id

        this.result.judgment = input.judge(touch.startTime, this.targetTime, this.windows)
        this.result.accuracy = touch.startTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playHitEffects()

        this.despawn = true
    }

    render() {
        if (time.now >= this.targetTime) return

        super.render()
    }
}
