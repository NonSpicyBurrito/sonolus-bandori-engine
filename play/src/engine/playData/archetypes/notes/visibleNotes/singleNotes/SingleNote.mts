import { perspectiveLayout } from '../../../../../../../../shared/src/engine/data/utils.mjs'
import { options } from '../../../../../configuration/options.mjs'
import { sfxDistance } from '../../../../effect.mjs'
import { lane } from '../../../../lane.mjs'
import { note } from '../../../../note.mjs'
import { circularEffectLayout, linearEffectLayout } from '../../../../particle.mjs'
import { VisibleNote } from '../VisibleNote.mjs'

export abstract class SingleNote extends VisibleNote {
    abstract sprites: {
        note: SkinSprite
    }

    abstract clips: {
        perfect: EffectClip
        great: EffectClip
        good: EffectClip
    }

    abstract effects: {
        circular: ParticleEffect
        linear: ParticleEffect
    }

    spriteLayout = this.entityMemory(Quad)

    initialize() {
        super.initialize()

        const w = 0.5 * options.noteSize
        const h = note.h * options.noteSize

        perspectiveLayout({
            l: this.data.lane - w,
            r: this.data.lane + w,
            t: 1 - h,
            b: 1 + h,
        }).copyTo(this.spriteLayout)

        lane.hitbox
            .get({
                l: this.data.lane,
                r: this.data.lane,
            })
            .copyTo(this.hitbox)
    }

    scheduleSFX() {
        super.scheduleSFX()

        this.clips.perfect.schedule(this.targetTime, sfxDistance)
    }

    render() {
        super.render()

        this.sprites.note.draw(this.spriteLayout.mul(this.y), this.z, 1)
    }

    playSFX() {
        if (this.result.judgment === Judgment.Perfect) {
            this.clips.perfect.play(sfxDistance)
        } else if (this.result.judgment === Judgment.Great) {
            this.clips.great.play(sfxDistance)
        } else if (this.result.judgment === Judgment.Good) {
            this.clips.good.play(sfxDistance)
        }
    }

    playLinearNoteEffect() {
        const layout = linearEffectLayout({
            lane: this.data.lane,
            size: 0.5,
        })

        this.effects.linear.spawn(layout, 0.4, false)
    }

    playCircularNoteEffect() {
        const layout = circularEffectLayout({
            lane: this.data.lane,
            w: 1.5,
            h: 1,
        })

        this.effects.circular.spawn(layout, 0.6, false)
    }
}
