import { approach } from '../../../../../../shared/src/engine/data/note.mjs'
import { perspectiveLayout } from '../../../../../../shared/src/engine/data/utils.mjs'
import { options } from '../../../configuration/options.mjs'
import { effect, getScheduleSFXTime } from '../../effect.mjs'
import { note } from '../../note.mjs'
import { particle } from '../../particle.mjs'
import { getZ, layer, skin } from '../../skin.mjs'
import { moveHold } from '../HoldManager.mjs'
import { archetypes } from '../index.mjs'

export abstract class SlideConnector extends Archetype {
    import = this.defineImport({
        firstRef: { name: 'first', type: Number },
        startRef: { name: 'start', type: Number },
        endRef: { name: 'end', type: Number },
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
    })

    abstract sprite: SkinSprite

    head = this.entityMemory({
        time: Number,
        lane: Number,

        l: Number,
        r: Number,
    })
    tail = this.entityMemory({
        time: Number,
        lane: Number,

        l: Number,
        r: Number,
    })

    scheduleSFXTime = this.entityMemory(Number)

    visualTime = this.entityMemory({
        min: Number,
        hidden: Number,
    })

    spawnTime = this.entityMemory(Number)

    hasSFXScheduled = this.entityMemory(Boolean)

    connector = this.entityMemory({
        z: Number,
    })

    slide = this.entityMemory({
        t: Number,
        b: Number,
        z: Number,
    })

    preprocess() {
        this.head.time = bpmChanges.at(this.headImport.beat).time

        this.scheduleSFXTime = getScheduleSFXTime(this.head.time)

        this.visualTime.min = this.head.time - note.duration

        this.spawnTime = Math.min(this.visualTime.min, this.scheduleSFXTime)
    }

    spawnOrder() {
        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        return time.now >= this.spawnTime
    }

    initialize() {
        const w = 0.5 * options.noteSize
        const h = note.h * options.noteSize

        this.head.lane = this.headImport.lane
        this.head.l = this.head.lane - w
        this.head.r = this.head.lane + w

        this.tail.time = bpmChanges.at(this.tailImport.beat).time
        this.tail.lane = this.tailImport.lane
        this.tail.l = this.tail.lane - w
        this.tail.r = this.tail.lane + w

        if (options.hidden > 0)
            this.visualTime.hidden = this.tail.time - note.duration * options.hidden

        this.connector.z = getZ(layer.note.connector, this.head.time, this.headImport.lane)

        this.slide.t = 1 - h
        this.slide.b = 1 + h
        this.slide.z = getZ(layer.note.slide, this.head.time, this.headImport.lane)
    }

    updateParallel() {
        if (
            time.now >= this.tail.time ||
            (this.startInfo.state === EntityState.Despawned &&
                !this.startSharedMemory.activatedTouchId) ||
            this.endInfo.state === EntityState.Despawned
        ) {
            this.despawn = true
            return
        }

        if (this.shouldScheduleSFX && !this.hasSFXScheduled && time.now >= this.scheduleSFXTime)
            this.scheduleSFX()

        if (time.now < this.visualTime.min) return

        this.renderConnector()

        if (time.now < this.head.time) return

        this.renderSlide()
        this.updateEffects()
    }

    get startInfo() {
        return entityInfos.get(this.import.startRef)
    }

    get startSharedMemory() {
        return archetypes.SlideStartNote.sharedMemory.get(this.import.startRef)
    }

    get endInfo() {
        return entityInfos.get(this.import.endRef)
    }

    get headImport() {
        return archetypes.SlideStartNote.import.get(this.import.headRef)
    }

    get tailImport() {
        return archetypes.SlideStartNote.import.get(this.import.tailRef)
    }

    get shouldScheduleSFX() {
        return options.sfxEnabled && effect.clips.hold.exists && options.autoSFX
    }

    get shouldUpdateCircularEffect() {
        return options.noteEffectEnabled && particle.effects.holdCircular.exists
    }

    get shouldUpdateLinearEffect() {
        return options.noteEffectEnabled && particle.effects.holdLinear.exists
    }

    scheduleSFX() {
        const id = effect.clips.hold.scheduleLoop(this.head.time)
        effect.clips.scheduleStopLoop(id, this.tail.time)

        this.hasSFXScheduled = true
    }

    renderConnector() {
        if (options.hidden > 0 && time.now > this.visualTime.hidden) return

        const hiddenDuration = options.hidden > 0 ? note.duration * options.hidden : 0

        const visibleTime = {
            min: Math.max(this.head.time, time.now + hiddenDuration),
            max: Math.min(this.tail.time, time.now + note.duration),
        }

        const l = {
            min: this.getL(visibleTime.min),
            max: this.getL(visibleTime.max),
        }

        const r = {
            min: this.getR(visibleTime.min),
            max: this.getR(visibleTime.max),
        }

        const y = {
            min: approach(visibleTime.min - note.duration, visibleTime.min, time.now),
            max: approach(visibleTime.max - note.duration, visibleTime.max, time.now),
        }

        const layout = {
            x1: l.min * y.min,
            x2: l.max * y.max,
            x3: r.max * y.max,
            x4: r.min * y.min,
            y1: y.min,
            y2: y.max,
            y3: y.max,
            y4: y.min,
        }

        this.sprite.draw(layout, this.connector.z, options.connectorAlpha)
    }

    renderSlide() {
        skin.sprites.slideNote.draw(
            perspectiveLayout({
                l: this.getL(time.now),
                r: this.getR(time.now),
                b: this.slide.b,
                t: this.slide.t,
            }),
            this.slide.z,
            1,
        )
    }

    updateEffects() {
        moveHold(this.import.firstRef, this.getLane(time.now))
    }

    getLane(time: number) {
        return Math.remap(this.head.time, this.tail.time, this.head.lane, this.tail.lane, time)
    }

    getL(time: number) {
        return Math.remap(this.head.time, this.tail.time, this.head.l, this.tail.l, time)
    }

    getR(time: number) {
        return Math.remap(this.head.time, this.tail.time, this.head.r, this.tail.r, time)
    }
}
