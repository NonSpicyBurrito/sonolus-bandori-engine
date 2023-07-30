import { effect } from '../../effect.mjs'
import { particle } from '../../particle.mjs'
import { playCircularNoteEffect, playLaneEffects, playLinearNoteEffect } from '../../utils.mjs'

export const slideEndNoteHit = {
    enter() {
        effect.clips.tapPerfect.play(0)

        playLinearNoteEffect(particle.effects.tapNoteLinear)
        playCircularNoteEffect(particle.effects.tapNoteCircular)
        playLaneEffects()
    },
}
