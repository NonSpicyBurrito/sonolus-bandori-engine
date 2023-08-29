import { skin } from '../../../../skin.mjs'
import { SingleFlickNote } from './SingleFlickNote.mjs'

export class SlideEndFlickNote extends SingleFlickNote {
    sprites = {
        note: skin.sprites.flickEndNote,
        arrow: skin.sprites.flickArrow,
    }
}
