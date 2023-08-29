import { skin } from '../../../../skin.mjs'
import { SingleFlickNote } from './SingleFlickNote.mjs'

export class FlickNote extends SingleFlickNote {
    sprites = {
        note: skin.sprites.flickNote,
        arrow: skin.sprites.flickArrow,
    }
}
