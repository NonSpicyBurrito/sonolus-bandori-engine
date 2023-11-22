import { effect } from '../../../../effect.mjs'
import { particle } from '../../../../particle.mjs'
import { skin } from '../../../../skin.mjs'
import { SingleNote } from './SingleNote.mjs'

export class SlideTickNote extends SingleNote {
    sprite = skin.sprites.tickNote

    clip = effect.clips.tapPerfect

    effects = {
        circular: particle.effects.tapNoteCircular,
        linear: particle.effects.tapNoteLinear,
    }

    globalPreprocess() {
        super.globalPreprocess()

        this.life.miss = -20
    }
}
