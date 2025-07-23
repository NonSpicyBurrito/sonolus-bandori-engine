import { connector } from '../../components/connector.js'
import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'
import { slide } from '../../components/slide.js'
import { effect, spawnCircularHoldEffect, spawnLinearHoldEffect } from '../../effect.js'
import { drawHand } from '../../instruction.js'
import { particle } from '../../particle.js'

let sfxInstanceId = tutorialMemory(LoopedEffectClipInstanceId)
const effectInstanceIds = tutorialMemory({
    circular: ParticleEffectInstanceId,
    linear: ParticleEffectInstanceId,
})

export const slideEndFlickNoteFall = {
    enter() {
        flickArrow.showFall('up')
        noteDisplay.showFall('flickEndNote')
        slide.show()
        connector.showFallOut()

        sfxInstanceId = effect.clips.hold.loop()
        effectInstanceIds.circular = spawnCircularHoldEffect()
        effectInstanceIds.linear = spawnLinearHoldEffect()
    },

    update() {
        drawHand(Math.PI / 3, 0, 0, 1)
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
        slide.clear()
        connector.clear()

        effect.clips.stopLoop(sfxInstanceId)
        particle.effects.destroy(effectInstanceIds.circular)
        particle.effects.destroy(effectInstanceIds.linear)
    },
}
