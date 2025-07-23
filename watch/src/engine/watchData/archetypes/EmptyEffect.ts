import { lane } from '../../../../../shared/src/engine/data/lane.js'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { particle } from '../particle.js'
import { scaledScreen } from '../scaledScreen.js'

export class EmptyEffect extends SpawnableArchetype({
    l: Number,
}) {
    initialized = this.entityMemory(Boolean)

    layout = this.entityMemory({
        lane: Quad,
        slot: Rect,
    })

    nextTime = this.entityMemory(Number)

    spawnTime() {
        return -999999
    }

    despawnTime() {
        return 999999
    }

    initialize() {
        if (this.initialized) return
        this.initialized = true

        this.globalInitialize()
    }

    updateParallel() {
        let shouldUpdate = false
        let shouldSpawn = false
        if (time.skip) {
            shouldUpdate = true
        } else if (time.now >= this.nextTime) {
            shouldUpdate = true
            shouldSpawn = true
        }

        if (shouldUpdate) {
            this.nextTime = streams.getNextKey(this.spawnData.l, time.now)
            if (this.nextTime === time.now) this.nextTime = 999999
        }

        if (shouldSpawn) {
            if (options.laneEffectEnabled) particle.effects.lane.spawn(this.layout.lane, 0.2, false)

            if (options.slotEffectEnabled) particle.effects.slot.spawn(this.layout.slot, 0.6, false)
        }
    }

    globalInitialize() {
        this.layout.lane.copyFrom(
            perspectiveLayout({
                l: this.spawnData.l,
                r: this.spawnData.l + 1,
                b: lane.b,
                t: lane.t,
            }),
        )

        const w = 0.5 * options.slotEffectSize
        const h = w * 2 * scaledScreen.wToH

        this.layout.slot.copyFrom(
            new Rect({
                l: this.spawnData.l + 0.5 - w,
                r: this.spawnData.l + 0.5 + w,
                t: 1 - h,
                b: 1,
            }),
        )
    }
}
