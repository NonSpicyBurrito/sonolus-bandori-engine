import { leftRotated, rightRotated } from '../../../../../../../../shared/src/engine/data/utils.mjs'
import { options } from '../../../../../configuration/options.mjs'
import { buckets } from '../../../../buckets.mjs'
import { effect, sfxDistance } from '../../../../effect.mjs'
import { flick } from '../../../../flick.mjs'
import { lane } from '../../../../lane.mjs'
import { note } from '../../../../note.mjs'
import { circularEffectLayout, particle } from '../../../../particle.mjs'
import { scaledScreen } from '../../../../scaledScreen.mjs'
import { getZ, layer, skin } from '../../../../skin.mjs'
import { windows } from '../../../../windows.mjs'
import { isUsed, markAsUsed } from '../../../InputManager.mjs'
import { VisibleNote } from '../VisibleNote.mjs'
import { FlickDirection } from './FlickDirection.mjs'

export class DirectionalFlickNote extends VisibleNote {
    directionalFlickData = this.defineData({
        direction: { name: 'direction', type: DataType<FlickDirection> },
        size: { name: 'size', type: Number },
    })

    dualWindows = windows.directionalFlickNote

    bucket = buckets.directionalFlickNote

    sprites = this.entityMemory({
        note: SkinSpriteId,
        arrow: SkinSpriteId,
    })

    clip = this.entityMemory(EffectClipId)

    effects = this.entityMemory({
        circular: ParticleEffectId,
        linear: ParticleEffectId,
    })

    arrow = this.entityMemory({
        layout: Quad,
        animation: Number,
        z: Number,
    })

    distance = this.entityMemory(Number)

    activatedTouchId = this.entityMemory(TouchId)

    preprocess() {
        super.preprocess()

        if (options.mirror) this.directionalFlickData.direction *= -1
    }

    initialize() {
        super.initialize()

        const size = this.directionalFlickData.size - 1

        if (this.directionalFlickData.direction === FlickDirection.Left) {
            const l = this.data.lane - size
            const r = this.data.lane

            lane.hitbox.get({ l, r }).copyTo(this.hitbox)
        } else {
            const l = this.data.lane
            const r = this.data.lane + size

            lane.hitbox.get({ l, r }).copyTo(this.hitbox)
        }

        if (this.directionalFlickData.direction === FlickDirection.Left) {
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

        if (effect.clips.directionalFlickSingle.exists && this.directionalFlickData.size === 1) {
            this.clip = effect.clips.directionalFlickSingle.id
        } else if (
            effect.clips.directionalFlickDouble.exists &&
            this.directionalFlickData.size === 2
        ) {
            this.clip = effect.clips.directionalFlickDouble.id
        } else if (effect.clips.directionalFlickTriple.exists) {
            this.clip = effect.clips.directionalFlickTriple.id
        } else {
            this.clip = effect.clips.flickPerfect.id
        }

        if (this.directionalFlickData.direction === FlickDirection.Left) {
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

        if (this.directionalFlickData.direction === FlickDirection.Left) {
            const lane = this.data.lane - this.directionalFlickData.size + 0.5

            const l = lane - w
            const r = lane

            leftRotated({ l, r, b, t }).copyTo(this.arrow.layout)
        } else {
            const lane = this.data.lane + this.directionalFlickData.size - 0.5

            const l = lane
            const r = lane + w

            rightRotated({ l, r, b, t }).copyTo(this.arrow.layout)
        }

        if (options.markerAnimation)
            this.arrow.animation = 0.25 * options.noteSize * this.directionalFlickData.direction

        this.arrow.z = getZ(layer.note.arrow, this.targetTime, this.data.lane)

        if (!options.autoplay)
            this.distance = 0.01 * this.directionalFlickData.size * flick.distance
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

            const p =
                (touch.position.x - touch.startPosition.x) * this.directionalFlickData.direction
            const d = touch.position.sub(touch.startPosition).length

            if (p >= 0 && d >= this.distance) {
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

    scheduleSFX() {
        super.scheduleSFX()

        effect.clips.schedule(this.clip, this.targetTime, sfxDistance)
    }

    render() {
        super.render()

        const w = 0.5 * options.noteSize
        const h = note.h * options.noteSize

        const t = 1 - h
        const b = 1 + h

        for (let i = 0; i < this.directionalFlickData.size; i++) {
            const lane = this.data.lane + this.directionalFlickData.direction * i
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

    playSFX() {
        effect.clips.play(this.clip, sfxDistance)
    }

    playLinearNoteEffect() {
        const w = options.noteEffectSize
        const h = 0.5 * scaledScreen.wToH * options.noteEffectSize

        const t = 1 - h
        const b = 1 + h

        if (this.directionalFlickData.direction === FlickDirection.Left) {
            const l = this.data.lane - w
            const r = this.data.lane

            particle.effects.spawn(this.effects.linear, leftRotated({ l, r, b, t }), 0.4, false)
        } else {
            const l = this.data.lane
            const r = this.data.lane + w

            particle.effects.spawn(this.effects.linear, rightRotated({ l, r, b, t }), 0.4, false)
        }
    }

    playCircularNoteEffect() {
        const layout = circularEffectLayout({
            lane: this.data.lane,
            w: 1.5,
            h: 1,
        })

        particle.effects.spawn(this.effects.circular, layout, 0.6, false)
    }
}
