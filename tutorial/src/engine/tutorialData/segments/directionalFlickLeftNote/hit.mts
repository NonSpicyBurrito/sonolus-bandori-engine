import {
    effect,
    playCircularNoteEffect,
    playLaneEffects,
    playLeftRotatedLinearNoteEffect,
} from '../../effect.mjs'
import { particle } from '../../particle.mjs'

export const directionalFlickLeftNoteHit = {
    enter() {
        if (effect.clips.directionalFlickSingle.exists) {
            effect.clips.directionalFlickSingle.play(0)
        } else {
            effect.clips.flickPerfect.play(0)
        }

        if (particle.effects.directionalFlickNoteLeftLinear.exists) {
            playLeftRotatedLinearNoteEffect(particle.effects.directionalFlickNoteLeftLinear)
        } else {
            playLeftRotatedLinearNoteEffect(particle.effects.directionalFlickNoteLeftLinearFallback)
        }
        if (particle.effects.directionalFlickNoteLeftCircular.exists) {
            playCircularNoteEffect(particle.effects.directionalFlickNoteLeftCircular)
        } else {
            playCircularNoteEffect(particle.effects.directionalFlickNoteLeftCircularFallback)
        }
        playLaneEffects()
    },
}
