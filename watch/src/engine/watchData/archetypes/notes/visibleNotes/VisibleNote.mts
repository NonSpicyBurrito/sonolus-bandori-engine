import { lane } from '../../../../../../../shared/src/engine/data/lane.mjs'
import { approach } from '../../../../../../../shared/src/engine/data/note.mjs'
import { perspectiveLayout } from '../../../../../../../shared/src/engine/data/utils.mjs'
import {
    DualWindows,
    toBucketWindows,
    toWindows,
} from '../../../../../../../shared/src/engine/data/windows.mjs'
import { options } from '../../../../configuration/options.mjs'
import { note } from '../../../note.mjs'
import { particle } from '../../../particle.mjs'
import { getZ, layer } from '../../../skin.mjs'
import { Note } from '../Note.mjs'

export abstract class VisibleNote extends Note {
    abstract dualWindows: DualWindows

    abstract bucket: Bucket

    hasInput = true

    sharedMemory = this.defineSharedMemory({
        despawnTime: Number,
    })

    targetTime = this.entityMemory(Number)

    visualTime = this.entityMemory(Range)
    hiddenTime = this.entityMemory(Number)

    initialized = this.entityMemory(Boolean)

    z = this.entityMemory(Number)

    y = this.entityMemory(Number)

    globalPreprocess() {
        this.bucket.set(toBucketWindows(this.windows))

        this.life.miss = -100
    }

    preprocess() {
        super.preprocess()

        this.targetTime = bpmChanges.at(this.import.beat).time

        this.visualTime.copyFrom(Range.l.mul(note.duration).add(this.targetTime))

        this.sharedMemory.despawnTime = this.hitTime

        if (options.sfxEnabled) {
            if (replay.isReplay) {
                this.scheduleReplaySFX()
            } else {
                this.scheduleSFX()
            }
        }

        this.result.time = this.targetTime

        if (!replay.isReplay) {
            this.result.bucket.index = this.bucket.index
        } else if (this.import.judgment) {
            this.result.bucket.index = this.bucket.index
            this.result.bucket.value = this.import.accuracy * 1000
        }
    }

    spawnTime() {
        return this.visualTime.min
    }

    despawnTime() {
        return this.sharedMemory.despawnTime
    }

    initialize() {
        if (this.initialized) return
        this.initialized = true

        this.globalInitialize()
    }

    updateParallel() {
        if (options.hidden > 0 && time.now > this.hiddenTime) return

        this.render()
    }

    terminate() {
        if (time.skip) return

        this.despawnTerminate()
    }

    get windows() {
        return toWindows(this.dualWindows, options.strictJudgment)
    }

    get hitTime() {
        return (
            this.targetTime +
            (replay.isReplay ? this.import.accuracy + this.import.accuracyDiff : 0)
        )
    }

    globalInitialize() {
        if (options.hidden > 0)
            this.hiddenTime = this.visualTime.max - note.duration * options.hidden

        this.z = getZ(layer.note.body, this.targetTime, this.import.lane)
    }

    abstract scheduleSFX(): void

    abstract scheduleReplaySFX(): void

    render() {
        this.y = approach(this.visualTime.min, this.visualTime.max, time.now)
    }

    despawnTerminate() {
        if (replay.isReplay && !this.import.judgment) return

        if (options.noteEffectEnabled) this.playNoteEffects()
        if (options.laneEffectEnabled) this.playLaneEffects()
    }

    playNoteEffects() {
        this.playLinearNoteEffect()
        this.playCircularNoteEffect()
    }

    abstract playLinearNoteEffect(): void

    abstract playCircularNoteEffect(): void

    playLaneEffects() {
        particle.effects.lane.spawn(
            perspectiveLayout({
                l: this.import.lane - 0.5,
                r: this.import.lane + 0.5,
                b: lane.b,
                t: lane.t,
            }),
            0.2,
            false,
        )
    }
}
