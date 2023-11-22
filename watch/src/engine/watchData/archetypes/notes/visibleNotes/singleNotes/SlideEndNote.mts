import { effect } from '../../../../effect.mjs'
import { particle } from '../../../../particle.mjs'
import { skin } from '../../../../skin.mjs'
import { SingleNote } from './SingleNote.mjs'

export class SlideEndNote extends SingleNote {
    sprite = skin.sprites.slideEndNote

    clip = effect.clips.tapPerfect

    effects = {
        circular: particle.effects.tapNoteCircular,
        linear: particle.effects.tapNoteLinear,
    }
}
