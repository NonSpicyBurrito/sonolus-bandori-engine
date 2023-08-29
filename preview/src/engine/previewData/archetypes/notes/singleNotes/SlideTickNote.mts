import { skin } from '../../../skin.mjs'
import { SingleNote } from './SingleNote.mjs'

export class SlideTickNote extends SingleNote {
    sprites = {
        note: skin.sprites.tickNote,
    }
}
