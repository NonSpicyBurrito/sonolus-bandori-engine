import { options } from '../../../../configuration/options.mjs'
import { note } from '../../../note.mjs'
import { panel } from '../../../panel.mjs'
import { getZ, layer } from '../../../skin.mjs'
import { Note } from '../Note.mjs'

export abstract class SingleNote extends Note {
    abstract sprite: SkinSprite

    render() {
        const time = bpmChanges.at(this.data.beat).time
        const pos = panel.getPos(time)

        const z = getZ(layer.note.body, time, this.data.lane)

        this.sprite.draw(
            new Rect({
                l: this.data.lane - 0.5 * options.noteSize,
                r: this.data.lane + 0.5 * options.noteSize,
                b: -note.h * options.noteSize,
                t: note.h * options.noteSize,
            }).add(pos),
            z,
            1,
        )

        return { time, pos }
    }
}
