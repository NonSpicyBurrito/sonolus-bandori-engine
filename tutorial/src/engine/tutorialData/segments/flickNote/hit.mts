import {
    effect,
    playCircularNoteEffect,
    playLaneEffects,
    playLinearNoteEffect,
} from '../../effect.mjs'
import { particle } from '../../particle.mjs'

export const flickNoteHit = {
    enter() {
        effect.clips.flickPerfect.play(0)

        playLinearNoteEffect(particle.effects.flickNoteLinear)
        playCircularNoteEffect(particle.effects.flickNoteCircular)
        playLaneEffects()
    },
}
