import {
    effect,
    playCircularNoteEffect,
    playLaneEffects,
    playLinearNoteEffect,
} from '../../effect.js'
import { particle } from '../../particle.js'

export const tapNoteHit = {
    enter() {
        effect.clips.tapPerfect.play(0)

        playLinearNoteEffect(particle.effects.tapNoteLinear)
        playCircularNoteEffect(particle.effects.tapNoteCircular)
        playLaneEffects()
    },
}
