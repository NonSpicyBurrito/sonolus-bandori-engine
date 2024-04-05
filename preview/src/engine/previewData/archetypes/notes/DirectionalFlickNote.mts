import { FlickDirection } from '../../../../../../shared/src/engine/data/FlickDirection.mjs'
import { leftRotated, rightRotated } from '../../../../../../shared/src/engine/data/utils.mjs'
import { options } from '../../../configuration/options.mjs'
import { note } from '../../note.mjs'
import { panel } from '../../panel.mjs'
import { scaledScreen } from '../../scaledScreen.mjs'
import { getZ, layer, skin } from '../../skin.mjs'
import { Note } from './Note.mjs'

export class DirectionalFlickNote extends Note {
    directionalFlickImport = this.defineImport({
        direction: { name: 'direction', type: DataType<FlickDirection> },
        size: { name: 'size', type: Number },
    })

    preprocess() {
        super.preprocess()

        if (options.mirror) this.directionalFlickImport.direction *= -1
    }

    render() {
        const time = bpmChanges.at(this.import.beat).time
        const pos = panel.getPos(time)

        const noteZ = getZ(layer.note.body, time, this.import.lane)
        const arrowZ = getZ(layer.note.arrow, time, this.import.lane)

        const { size, direction } = this.directionalFlickImport

        const noteSpriteId =
            direction === FlickDirection.Left
                ? skin.sprites.directionalFlickLeftNote.exists
                    ? skin.sprites.directionalFlickLeftNote.id
                    : skin.sprites.directionalFlickLeftNoteFallback.id
                : skin.sprites.directionalFlickRightNote.exists
                  ? skin.sprites.directionalFlickRightNote.id
                  : skin.sprites.directionalFlickRightNoteFallback.id
        const arrowSpriteId =
            direction === FlickDirection.Left
                ? skin.sprites.directionalFlickLeftArrow.exists
                    ? skin.sprites.directionalFlickLeftArrow.id
                    : skin.sprites.directionalFlickLeftArrowFallback.id
                : skin.sprites.directionalFlickRightArrow.exists
                  ? skin.sprites.directionalFlickRightArrow.id
                  : skin.sprites.directionalFlickRightArrowFallback.id

        for (let i = 0; i < size; i++) {
            skin.sprites.draw(
                noteSpriteId,
                new Rect({
                    l: this.import.lane + i * direction - 0.5 * options.noteSize,
                    r: this.import.lane + i * direction + 0.5 * options.noteSize,
                    b: -note.h * options.noteSize,
                    t: note.h * options.noteSize,
                }).add(pos),
                noteZ,
                1,
            )
        }

        const b = -0.5 * scaledScreen.wToH * options.noteSize
        const t = 0.5 * scaledScreen.wToH * options.noteSize

        if (direction === FlickDirection.Left) {
            const lane = this.import.lane - size + 0.5

            const l = lane - options.noteSize
            const r = lane

            skin.sprites.draw(arrowSpriteId, leftRotated({ l, r, b, t }).add(pos), arrowZ, 1)
        } else {
            const lane = this.import.lane + size - 0.5

            const l = lane
            const r = lane + options.noteSize

            skin.sprites.draw(arrowSpriteId, rightRotated({ l, r, b, t }).add(pos), arrowZ, 1)
        }
    }
}
