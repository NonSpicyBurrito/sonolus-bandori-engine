import { options } from '../../../../configuration/options.js'
import { note } from '../../../note.js'
import { panel } from '../../../panel.js'
import { layer } from '../../../skin.js'
import { Note } from '../Note.js'

export abstract class SingleNote extends Note {
    abstract sprite: SkinSprite

    render() {
        const time = bpmChanges.at(this.import.beat).time
        const pos = panel.getPos(time)

        this.sprite.draw(
            new Rect({
                l: this.import.lane - 0.5 * options.noteSize,
                r: this.import.lane + 0.5 * options.noteSize,
                b: -note.h * options.noteSize,
                t: note.h * options.noteSize,
            }).add(pos),
            [layer.note.body, -time, -this.import.lane],
            1,
        )

        return { time, pos }
    }
}
