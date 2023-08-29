import { options } from '../../../../../configuration/options.mjs'
import { panel } from '../../../../panel.mjs'
import { scaledScreen } from '../../../../scaledScreen.mjs'
import { getZ, layer } from '../../../../skin.mjs'
import { SingleNote } from '../SingleNote.mjs'

export abstract class SingleFlickNote extends SingleNote {
    abstract sprites: {
        note: SkinSprite
        arrow: SkinSprite
    }

    render() {
        super.render()

        const time = bpmChanges.at(this.data.beat).time

        const position = panel.positionFromTime(time)
        const z = getZ(layer.note.arrow, time, this.data.lane)

        this.sprites.arrow.draw(
            new Rect({
                l: this.data.lane - 0.5 * options.noteSize,
                r: this.data.lane + 0.5 * options.noteSize,
                b: 0,
                t: scaledScreen.wToH * options.noteSize,
            }).add(position),
            z,
            1,
        )
    }
}
