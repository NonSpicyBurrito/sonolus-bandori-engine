import { FlickDirection } from '../../../../../../../shared/src/engine/data/FlickDirection.mjs'
import { leftRotated, rightRotated } from '../../../../../../../shared/src/engine/data/utils.mjs'
import { options } from '../../../../configuration/options.mjs'
import { effect, sfxDistance } from '../../../effect.mjs'
import { note } from '../../../note.mjs'
import { circularEffectLayout, particle } from '../../../particle.mjs'
import { scaledScreen } from '../../../scaledScreen.mjs'
import { getZ, layer, skin } from '../../../skin.mjs'
import { VisibleNote } from './VisibleNote.mjs'

export class DirectionalFlickNote extends VisibleNote {
    directionalFlickImport = this.defineImport({
        direction: { name: 'direction', type: DataType<FlickDirection> },
        size: { name: 'size', type: Number },
    })

    sprites = this.entityMemory({
        note: SkinSpriteId,
        arrow: SkinSpriteId,
    })

    effects = this.entityMemory({
        circular: ParticleEffectId,
        linear: ParticleEffectId,
    })

    arrow = this.entityMemory({
        layout: Quad,
        animation: Number,
        z: Number,
    })

    preprocess() {
        super.preprocess()

        if (options.mirror) this.directionalFlickImport.direction *= -1
    }

    globalInitialize() {
        super.globalInitialize()

        if (this.directionalFlickImport.direction === FlickDirection.Left) {
            this.sprites.note = skin.sprites.directionalFlickLeftNote.exists
                ? skin.sprites.directionalFlickLeftNote.id
                : skin.sprites.directionalFlickLeftNoteFallback.id
            this.sprites.arrow = skin.sprites.directionalFlickLeftArrow.exists
                ? skin.sprites.directionalFlickLeftArrow.id
                : skin.sprites.directionalFlickLeftArrowFallback.id
        } else {
            this.sprites.note = skin.sprites.directionalFlickRightNote.exists
                ? skin.sprites.directionalFlickRightNote.id
                : skin.sprites.directionalFlickRightNoteFallback.id
            this.sprites.arrow = skin.sprites.directionalFlickRightArrow.exists
                ? skin.sprites.directionalFlickRightArrow.id
                : skin.sprites.directionalFlickRightArrowFallback.id
        }

        if (this.directionalFlickImport.direction === FlickDirection.Left) {
            this.effects.circular = particle.effects.directionalFlickNoteLeftCircular.exists
                ? particle.effects.directionalFlickNoteLeftCircular.id
                : particle.effects.directionalFlickNoteLeftCircularFallback.id
            this.effects.linear = particle.effects.directionalFlickNoteLeftLinear.exists
                ? particle.effects.directionalFlickNoteLeftLinear.id
                : particle.effects.directionalFlickNoteLeftLinearFallback.id
        } else {
            this.effects.circular = particle.effects.directionalFlickNoteRightCircular.exists
                ? particle.effects.directionalFlickNoteRightCircular.id
                : particle.effects.directionalFlickNoteRightCircularFallback.id
            this.effects.linear = particle.effects.directionalFlickNoteRightLinear.exists
                ? particle.effects.directionalFlickNoteRightLinear.id
                : particle.effects.directionalFlickNoteRightLinearFallback.id
        }

        const w = options.noteSize
        const h = 0.5 * scaledScreen.wToH * options.noteSize

        const t = 1 - h
        const b = 1 + h

        if (this.directionalFlickImport.direction === FlickDirection.Left) {
            const lane = this.import.lane - this.directionalFlickImport.size + 0.5

            const l = lane - w
            const r = lane

            leftRotated({ l, r, b, t }).copyTo(this.arrow.layout)
        } else {
            const lane = this.import.lane + this.directionalFlickImport.size - 0.5

            const l = lane
            const r = lane + w

            rightRotated({ l, r, b, t }).copyTo(this.arrow.layout)
        }

        if (options.markerAnimation)
            this.arrow.animation = 0.25 * options.noteSize * this.directionalFlickImport.direction

        this.arrow.z = getZ(layer.note.arrow, this.targetTime, this.import.lane)
    }

    scheduleSFX() {
        if (effect.clips.directionalFlickSingle.exists && this.directionalFlickImport.size === 1) {
            effect.clips.directionalFlickSingle.schedule(this.targetTime, sfxDistance)
        } else if (
            effect.clips.directionalFlickDouble.exists &&
            this.directionalFlickImport.size === 2
        ) {
            effect.clips.directionalFlickDouble.schedule(this.targetTime, sfxDistance)
        } else if (effect.clips.directionalFlickTriple.exists) {
            effect.clips.directionalFlickTriple.schedule(this.targetTime, sfxDistance)
        } else {
            effect.clips.flickPerfect.schedule(this.targetTime, sfxDistance)
        }
    }

    scheduleReplaySFX() {
        if (!this.import.judgment) return

        if (effect.clips.directionalFlickSingle.exists && this.directionalFlickImport.size === 1) {
            effect.clips.directionalFlickSingle.schedule(this.hitTime, sfxDistance)
        } else if (
            effect.clips.directionalFlickDouble.exists &&
            this.directionalFlickImport.size === 2
        ) {
            effect.clips.directionalFlickDouble.schedule(this.hitTime, sfxDistance)
        } else if (effect.clips.directionalFlickTriple.exists) {
            effect.clips.directionalFlickTriple.schedule(this.hitTime, sfxDistance)
        } else {
            effect.clips.flickPerfect.schedule(this.hitTime, sfxDistance)
        }
    }

    render() {
        super.render()

        const w = 0.5 * options.noteSize
        const h = note.h * options.noteSize

        const t = 1 - h
        const b = 1 + h

        for (let i = 0; i < this.directionalFlickImport.size; i++) {
            const lane = this.import.lane + this.directionalFlickImport.direction * i
            const layout = new Quad({
                x1: (lane - w) * b,
                x2: (lane - w) * t,
                x3: (lane + w) * t,
                x4: (lane + w) * b,
                y1: b,
                y2: t,
                y3: t,
                y4: b,
            })

            skin.sprites.draw(this.sprites.note, layout.mul(this.y), this.z, 1)
        }

        if (options.markerAnimation) {
            const x = Math.lerp(
                -this.arrow.animation,
                this.arrow.animation,
                Math.frac((time.now - this.targetTime) * 3 + 0.5),
            )

            skin.sprites.draw(
                this.sprites.arrow,
                this.arrow.layout.add({ x, y: 0 }).mul(this.y),
                this.arrow.z,
                1,
            )
        } else {
            skin.sprites.draw(this.sprites.arrow, this.arrow.layout.mul(this.y), this.arrow.z, 1)
        }
    }

    playLinearNoteEffect() {
        const w = options.noteEffectSize
        const h = 0.5 * scaledScreen.wToH * options.noteEffectSize

        const t = 1 - h
        const b = 1 + h

        if (this.directionalFlickImport.direction === FlickDirection.Left) {
            const l = this.import.lane - w
            const r = this.import.lane

            particle.effects.spawn(this.effects.linear, leftRotated({ l, r, b, t }), 0.4, false)
        } else {
            const l = this.import.lane
            const r = this.import.lane + w

            particle.effects.spawn(this.effects.linear, rightRotated({ l, r, b, t }), 0.4, false)
        }
    }

    playCircularNoteEffect() {
        const layout = circularEffectLayout({
            lane: this.import.lane,
            w: 1.5,
            h: 1,
        })

        particle.effects.spawn(this.effects.circular, layout, 0.6, false)
    }
}
