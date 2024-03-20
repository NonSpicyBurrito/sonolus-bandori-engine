import { options } from '../../../../../../configuration/options.mjs'
import { effect } from '../../../../../effect.mjs'
import { particle } from '../../../../../particle.mjs'
import { scaledScreen } from '../../../../../scaledScreen.mjs'
import { getZ, layer, skin } from '../../../../../skin.mjs'
import { SingleNote } from '../SingleNote.mjs'

export abstract class SingleFlickNote extends SingleNote {
    clips = {
        perfect: effect.clips.flickPerfect,
        great: effect.clips.flickGreat,
        good: effect.clips.flickGood,
    }

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
            l: this.import.lane - w,
            r: this.import.lane + w,
            t: 1 - h,
            b: 1,
        }).copyTo(this.arrow.layout)

        if (options.markerAnimation) this.arrow.animation = 0.25 * h

        this.arrow.z = getZ(layer.note.arrow, this.targetTime, this.import.lane)
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
