import { windows } from '../../../../../../../../shared/src/engine/data/windows.js'
import { buckets } from '../../../../buckets.js'
import { effect } from '../../../../effect.js'
import { particle } from '../../../../particle.js'
import { skin } from '../../../../skin.js'
import { SingleNote } from './SingleNote.js'

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

        this.archetypeLife.miss = -20
    }

    render() {
        if (time.now >= this.targetTime) return

        super.render()
    }
}
