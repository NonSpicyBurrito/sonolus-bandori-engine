import {
    effect,
    playCircularNoteEffect,
    playLaneEffects,
    playRightRotatedLinearNoteEffect,
} from '../../effect.js'
import { particle } from '../../particle.js'

export const directionalFlickRightNoteHit = {
    enter() {
        if (effect.clips.directionalFlickSingle.exists) {
            effect.clips.directionalFlickSingle.play(0)
        } else {
            effect.clips.flickPerfect.play(0)
        }

        if (particle.effects.directionalFlickNoteRightLinear.exists) {
            playRightRotatedLinearNoteEffect(particle.effects.directionalFlickNoteRightLinear)
        } else {
            playRightRotatedLinearNoteEffect(
                particle.effects.directionalFlickNoteRightLinearFallback,
            )
        }
        if (particle.effects.directionalFlickNoteRightCircular.exists) {
            playCircularNoteEffect(particle.effects.directionalFlickNoteRightCircular)
        } else {
            playCircularNoteEffect(particle.effects.directionalFlickNoteRightCircularFallback)
        }
        playLaneEffects()
    },
}
