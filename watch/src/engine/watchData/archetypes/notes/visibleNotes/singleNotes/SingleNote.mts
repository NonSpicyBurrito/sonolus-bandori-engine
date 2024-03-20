import { perspectiveLayout } from '../../../../../../../../shared/src/engine/data/utils.mjs'
import { options } from '../../../../../configuration/options.mjs'
import { sfxDistance } from '../../../../effect.mjs'
import { note } from '../../../../note.mjs'
import { circularEffectLayout, linearEffectLayout } from '../../../../particle.mjs'
import { VisibleNote } from '../VisibleNote.mjs'

export abstract class SingleNote extends VisibleNote {
    abstract sprite: SkinSprite

    abstract clip: EffectClip

    abstract effects: {
        circular: ParticleEffect
        linear: ParticleEffect
    }

    spriteLayout = this.entityMemory(Quad)

    globalInitialize() {
        super.globalInitialize()

        const w = 0.5 * options.noteSize
        const h = note.h * options.noteSize

        perspectiveLayout({
            l: this.import.lane - w,
            r: this.import.lane + w,
            t: 1 - h,
            b: 1 + h,
        }).copyTo(this.spriteLayout)
    }

    scheduleSFX() {
        this.clip.schedule(this.targetTime, sfxDistance)
    }

    render() {
        super.render()

        this.sprite.draw(this.spriteLayout.mul(this.y), this.z, 1)
    }

    playLinearNoteEffect() {
        const layout = linearEffectLayout({
            lane: this.import.lane,
            size: 0.5,
        })

        this.effects.linear.spawn(layout, 0.4, false)
    }

    playCircularNoteEffect() {
        const layout = circularEffectLayout({
            lane: this.import.lane,
            w: 1.5,
            h: 1,
        })

        this.effects.circular.spawn(layout, 0.6, false)
    }
}
