import { effect } from '../../effect.mjs'
import { particle } from '../../particle.mjs'
import { playCircularNoteEffect, playLaneEffects, playLinearNoteEffect } from '../../utils.mjs'

export const slideEndFlickNoteHit = {
    enter() {
        effect.clips.flickPerfect.play(0)

        playLinearNoteEffect(particle.effects.flickNoteLinear)
        playCircularNoteEffect(particle.effects.flickNoteCircular)
        playLaneEffects()
    },
}
