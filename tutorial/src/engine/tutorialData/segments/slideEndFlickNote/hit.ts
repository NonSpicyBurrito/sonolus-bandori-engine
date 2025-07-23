import {
    effect,
    playCircularNoteEffect,
    playLaneEffects,
    playLinearNoteEffect,
} from '../../effect.js'
import { particle } from '../../particle.js'

export const slideEndFlickNoteHit = {
    enter() {
        effect.clips.flickPerfect.play(0)

        playLinearNoteEffect(particle.effects.flickNoteLinear)
        playCircularNoteEffect(particle.effects.flickNoteCircular)
        playLaneEffects()
    },
}
