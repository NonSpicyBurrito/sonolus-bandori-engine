import { options } from '../../../../../configuration/options.js'
import { scaledScreen } from '../../../../scaledScreen.js'
import { layer, skin } from '../../../../skin.js'
import { SingleNote } from '../SingleNote.js'

export abstract class SingleFlickNote extends SingleNote {
    render() {
        const { time, pos } = super.render()

        skin.sprites.flickArrow.draw(
            new Rect({
                l: this.import.lane - 0.5 * options.noteSize,
                r: this.import.lane + 0.5 * options.noteSize,
                b: 0,
                t: scaledScreen.wToH * options.noteSize,
            }).add(pos),
            [layer.note.arrow, -time, -this.import.lane],
            1,
        )

        return { time, pos }
    }
}
