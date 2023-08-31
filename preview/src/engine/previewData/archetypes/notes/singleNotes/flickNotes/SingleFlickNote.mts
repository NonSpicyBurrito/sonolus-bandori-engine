import { options } from '../../../../../configuration/options.mjs'
import { scaledScreen } from '../../../../scaledScreen.mjs'
import { getZ, layer, skin } from '../../../../skin.mjs'
import { SingleNote } from '../SingleNote.mjs'

export abstract class SingleFlickNote extends SingleNote {
    render() {
        const { time, position } = super.render()

        const z = getZ(layer.note.arrow, time, this.data.lane)

        skin.sprites.flickArrow.draw(
            new Rect({
                l: this.data.lane - 0.5 * options.noteSize,
                r: this.data.lane + 0.5 * options.noteSize,
                b: 0,
                t: scaledScreen.wToH * options.noteSize,
            }).add(position),
            z,
            1,
        )

        return { time, position }
    }
}
