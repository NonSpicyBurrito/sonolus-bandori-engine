import { windows } from '../../../../../../../../../shared/src/engine/data/windows.js'
import { buckets } from '../../../../../buckets.js'
import { skin } from '../../../../../skin.js'
import { SingleFlickNote } from './SingleFlickNote.js'

export class FlickNote extends SingleFlickNote {
    sprite = skin.sprites.flickNote

    dualWindows = windows.flickNote

    bucket = buckets.flickNote
}
