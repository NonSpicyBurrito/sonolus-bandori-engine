import { windows } from '../../../../../../../../../shared/src/engine/data/windows.js'
import { buckets } from '../../../../../buckets.js'
import { skin } from '../../../../../skin.js'
import { SingleFlickNote } from './SingleFlickNote.js'

export class SlideEndFlickNote extends SingleFlickNote {
    sprite = skin.sprites.flickEndNote

    dualWindows = windows.slideEndFlickNote

    bucket = buckets.slideEndFlickNote
}
