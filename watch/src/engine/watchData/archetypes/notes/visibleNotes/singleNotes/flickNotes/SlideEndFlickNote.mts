import { windows } from '../../../../../../../../../shared/src/engine/data/windows.mjs'
import { buckets } from '../../../../../buckets.mjs'
import { skin } from '../../../../../skin.mjs'
import { SingleFlickNote } from './SingleFlickNote.mjs'

export class SlideEndFlickNote extends SingleFlickNote {
    sprite = skin.sprites.flickEndNote

    dualWindows = windows.slideEndFlickNote

    bucket = buckets.slideEndFlickNote
}
