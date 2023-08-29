import { skin } from '../../../skin.mjs'
import { SingleNote } from './SingleNote.mjs'

export class SlideEndNote extends SingleNote {
    sprites = {
        note: skin.sprites.slideNote,
    }
}
