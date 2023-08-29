import { skin } from '../../../skin.mjs'
import { SingleNote } from './SingleNote.mjs'

export class TapNote extends SingleNote {
    sprites = {
        note: skin.sprites.tapNote,
    }
}
