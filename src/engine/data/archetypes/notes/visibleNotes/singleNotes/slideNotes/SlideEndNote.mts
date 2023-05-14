import { options } from '../../../../../../configuration/options.mjs'
import { buckets } from '../../../../../buckets.mjs'
import { effect } from '../../../../../effect.mjs'
import { particle } from '../../../../../particle.mjs'
import { skin } from '../../../../../skin.mjs'
import { SlideConnector } from '../../../../sliderConnectors/SlideConnector.mjs'
import { windows } from '../../../../windows.mjs'
import { SlideNote } from './SlideNote.mjs'

export class SlideEndNote extends SlideNote {
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

    dualWindows = windows.slideEndNote

    bucket = buckets.slideEndNote

    preprocess() {
        super.preprocess()

        const minPrevInputTime =
            bpmChanges.at(this.prevData.beat).time + windows.minGood + input.offset

        this.spawnTime = Math.min(this.spawnTime, minPrevInputTime)
    }

    touch() {
        if (options.autoplay) return

        const id = this.prevSharedMemory.activatedTouchId
        if (id) {
            if (time.now > this.inputTime.max) {
                this.endSlideEffects()
                return
            }

            for (const touch of touches) {
                if (touch.id !== id) continue

                if (!touch.ended) return

                if (time.now >= this.inputTime.min && this.hitbox.contains(touch.position)) {
                    this.complete(touch.t)
                } else {
                    this.despawn = true
                }
                this.endSlideEffects()
                return
            }

            if (time.now >= this.inputTime.min) {
                this.complete(time.now)
            } else {
                this.despawn = true
            }
            this.endSlideEffects()
            return
        }

        if (this.prevInfo.state !== EntityState.Despawned) return
        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            if (!touch.ended) continue
            if (!this.hitbox.contains(touch.position)) continue

            this.complete(touch.t)
            return
        }
    }

    terminate() {
        super.terminate()

        if (SlideConnector.shouldScheduleCircularEffect)
            particle.effects.destroy(this.prevSharedMemory.effectInstanceIds.circular)

        if (SlideConnector.shouldScheduleLinearEffect)
            particle.effects.destroy(this.prevSharedMemory.effectInstanceIds.linear)
    }

    complete(hitTime: number) {
        this.result.judgment = input.judge(hitTime, this.targetTime, this.windows)
        this.result.accuracy = hitTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playHitEffects()

        this.despawn = true
    }
}
