import { windows } from '../../../../../../../../shared/src/engine/data/windows.mjs'
import { buckets } from '../../../../buckets.mjs'
import { effect } from '../../../../effect.mjs'
import { particle } from '../../../../particle.mjs'
import { skin } from '../../../../skin.mjs'
import { SingleNote } from './SingleNote.mjs'

export class SlideTickNote extends SingleNote {
    sprite = skin.sprites.tickNote

    clips = {
        perfect: effect.clips.tapPerfect,
        great: effect.clips.tapGreat,
        good: effect.clips.tapGood,
    }

    effects = {
        circular: particle.effects.tapNoteCircular,
        linear: particle.effects.tapNoteLinear,
    }

    dualWindows = windows.slideTickNote

    bucket = buckets.slideTickNote

    globalPreprocess() {
        super.globalPreprocess()

        this.life.miss = -20
    }

    render() {
        if (time.now >= this.targetTime) return

        super.render()
    }
}
