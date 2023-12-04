import { options } from '../../../../../../configuration/options.mjs'
import { effect } from '../../../../../effect.mjs'
import { particle } from '../../../../../particle.mjs'
import { scaledScreen } from '../../../../../scaledScreen.mjs'
import { getZ, layer, skin } from '../../../../../skin.mjs'
import { SingleNote } from '../SingleNote.mjs'

export abstract class SingleFlickNote extends SingleNote {
    clip = effect.clips.flickPerfect

    effects = {
        circular: particle.effects.flickNoteCircular,
        linear: particle.effects.flickNoteLinear,
    }

    arrow = this.entityMemory({
        layout: Rect,
        animation: Number,
        z: Number,
    })

    globalInitialize() {
        super.globalInitialize()

        const w = 0.5 * options.noteSize
        const h = scaledScreen.wToH * options.noteSize

        new Rect({
            l: this.data.lane - w,
            r: this.data.lane + w,
            t: 1 - h,
            b: 1,
        }).copyTo(this.arrow.layout)

        if (options.markerAnimation) this.arrow.animation = 0.25 * h

        this.arrow.z = getZ(layer.note.arrow, this.targetTime, this.data.lane)
    }

    render() {
        super.render()

        if (options.markerAnimation) {
            const y = Math.lerp(
                -this.arrow.animation,
                this.arrow.animation,
                Math.frac((time.now - this.targetTime) * 3 + 0.5),
            )

            skin.sprites.flickArrow.draw(
                this.arrow.layout.sub({ x: 0, y }).mul(this.y),
                this.arrow.z,
                1,
            )
        } else {
            skin.sprites.flickArrow.draw(this.arrow.layout.mul(this.y), this.arrow.z, 1)
        }
    }
}
