import {
    effect,
    playCircularNoteEffect,
    playLaneEffects,
    playLinearNoteEffect,
} from '../../effect.mjs'
import { particle } from '../../particle.mjs'

export const slideEndNoteHit = {
    enter() {
        effect.clips.tapPerfect.play(0)

        playLinearNoteEffect(particle.effects.tapNoteLinear)
        playCircularNoteEffect(particle.effects.tapNoteCircular)
        playLaneEffects()
    },
}
