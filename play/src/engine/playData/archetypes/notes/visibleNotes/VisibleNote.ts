import { approach } from '../../../../../../../shared/src/engine/data/note.js'
import { perspectiveLayout } from '../../../../../../../shared/src/engine/data/utils.js'
import {
    DualWindows,
    toBucketWindows,
    toWindows,
} from '../../../../../../../shared/src/engine/data/windows.js'
import { options } from '../../../../configuration/options.js'
import { lane } from '../../../lane.js'
import { note } from '../../../note.js'
import { particle } from '../../../particle.js'
import { getZ, layer } from '../../../skin.js'
import { Note } from '../Note.js'

export abstract class VisibleNote extends Note {
    export = this.defineExport({
        accuracyDiff: { name: 'accuracyDiff', type: Number },
    })

    abstract dualWindows: DualWindows

    abstract bucket: Bucket

    visualTime = this.entityMemory(Range)
    hiddenTime = this.entityMemory(Number)

    inputTime = this.entityMemory(Range)

    z = this.entityMemory(Number)

    y = this.entityMemory(Number)

    globalPreprocess() {
        this.bucket.set(toBucketWindows(this.windows))

        this.life.miss = -100
    }

    preprocess() {
        super.preprocess()

        this.visualTime.copyFrom(Range.l.mul(note.duration).add(this.targetTime))

        this.inputTime.min = this.getMinInputTime()

        this.spawnTime = Math.min(this.visualTime.min, this.inputTime.min)

        if (this.shouldScheduleSFX) this.scheduleSFX()
    }

    initialize() {
        if (options.hidden > 0)
            this.hiddenTime = this.visualTime.max - note.duration * options.hidden

        this.inputTime.max = this.targetTime + this.windows.good.max + input.offset

        this.z = getZ(layer.note.body, this.targetTime, this.import.lane)

        this.result.accuracy = this.windows.good.max
    }

    updateParallel() {
        if (time.now > this.inputTime.max) this.despawn = true
        if (this.despawn) return

        if (time.now < this.visualTime.min) return
        if (options.hidden > 0 && time.now > this.hiddenTime) return

        this.render()
    }

    get windows() {
        return toWindows(this.dualWindows, options.strictJudgment)
    }

    get shouldScheduleSFX() {
        return options.sfxEnabled && options.autoSFX
    }

    get shouldPlaySFX() {
        return options.sfxEnabled && !options.autoSFX
    }

    getMinInputTime() {
        return this.targetTime + this.windows.good.min + input.offset
    }

    abstract scheduleSFX(): void

    render() {
        this.y = approach(this.visualTime.min, this.visualTime.max, time.now)
    }

    incomplete(hitTime: number) {
        this.export('accuracyDiff', hitTime - this.result.accuracy - this.targetTime)

        this.despawn = true
    }

    playHitEffects() {
        if (this.shouldPlaySFX) this.playSFX()
        if (options.noteEffectEnabled) this.playNoteEffects()
        if (options.laneEffectEnabled) this.playLaneEffects()
    }

    abstract playSFX(): void

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
