import { options } from '../../../../configuration/options.mjs'
import { note } from '../../../note.mjs'
import { panel } from '../../../panel.mjs'
import { getZ, layer } from '../../../skin.mjs'
import { Note } from '../Note.mjs'

export abstract class SingleNote extends Note {
    abstract sprites: {
        note: SkinSprite
    }

    render() {
        const time = bpmChanges.at(this.data.beat).time

        const position = panel.positionFromTime(time)
        const z = getZ(layer.note.body, time, this.data.lane)

        this.sprites.note.draw(
            new Rect({
                l: this.data.lane - 0.5 * options.noteSize,
                r: this.data.lane + 0.5 * options.noteSize,
                b: -note.h * options.noteSize,
                t: note.h * options.noteSize,
            }).add(position),
            z,
            1,
        )
    }
}
