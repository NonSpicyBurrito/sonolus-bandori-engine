import { connector } from '../../components/connector.js'
import { slide } from '../../components/slide.js'
import {
    effect,
    playCircularNoteEffect,
    playLaneEffects,
    playLinearNoteEffect,
    spawnCircularHoldEffect,
    spawnLinearHoldEffect,
} from '../../effect.js'
import { drawHand } from '../../instruction.js'
import { particle } from '../../particle.js'

let sfxInstanceId = tutorialMemory(LoopedEffectClipInstanceId)
const effectInstanceIds = tutorialMemory({
    circular: ParticleEffectInstanceId,
    linear: ParticleEffectInstanceId,
})

export const slideStartNoteHit = {
    enter() {
        slide.show()
        connector.showFrozen()

        effect.clips.tapPerfect.play(0)

        playLinearNoteEffect(particle.effects.tapNoteLinear)
        playCircularNoteEffect(particle.effects.tapNoteCircular)
        playLaneEffects()

        sfxInstanceId = effect.clips.hold.loop()
        effectInstanceIds.circular = spawnCircularHoldEffect()
        effectInstanceIds.linear = spawnLinearHoldEffect()
    },

    update() {
        drawHand(Math.PI / 3, 0, 0, 1)
    },

    exit() {
        slide.clear()
        connector.clear()

        effect.clips.stopLoop(sfxInstanceId)
        particle.effects.destroy(effectInstanceIds.circular)
        particle.effects.destroy(effectInstanceIds.linear)
    },
}
