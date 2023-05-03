import { EngineArchetypeDataName } from 'sonolus-core'
import { options } from '../../../configuration/options.mjs'

export abstract class Note extends Archetype {
    hasInput = true

    data = this.defineData({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
    })

    targetTime = this.entityMemory(Number)

    spawnTime = this.entityMemory(Number)

    hitbox = this.entityMemory(Rect)

    preprocess() {
        this.targetTime = bpmChanges.at(this.data.beat).time

        if (options.mirror) this.data.lane *= -1
    }

    spawnOrder() {
        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        return time.now >= this.spawnTime
    }

    touchOrder = 1

    static approach(fromTime: number, toTime: number, now: number) {
        return Math.lerp(0.05, 1, 1.1 ** (50 * Math.remap(fromTime, toTime, -1, 0, now)))
    }

    static get duration() {
        return options.noteSpeed <= 11
            ? (12 - options.noteSpeed) / 2
            : (16 - options.noteSpeed) / 10
    }
}
