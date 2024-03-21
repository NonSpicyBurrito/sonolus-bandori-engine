import { windows } from '../../../../../../../../../shared/src/engine/data/windows.mjs'
import { buckets } from '../../../../../buckets.mjs'
import { skin } from '../../../../../skin.mjs'
import { SingleFlickNote } from './SingleFlickNote.mjs'

export class FlickNote extends SingleFlickNote {
    sprite = skin.sprites.flickNote

    dualWindows = windows.flickNote

    bucket = buckets.flickNote
}
