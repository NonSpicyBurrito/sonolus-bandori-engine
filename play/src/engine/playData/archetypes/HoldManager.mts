import { options } from '../../configuration/options.mjs'
import { effect } from '../effect.mjs'
import { circularEffectLayout, linearEffectLayout, particle } from '../particle.mjs'

const Hold = {
    clipInstanceId: LoopedEffectClipInstanceId,
    effectInstanceIds: {
        circular: ParticleEffectInstanceId,
        linear: ParticleEffectInstanceId,
    },
}

const holds = levelMemory({
    queue: Collection(16, Number),
    old: Dictionary(16, Number, Hold),
    now: Dictionary(16, Number, Hold),
})

export const queueHold = (id: number) => {
    holds.queue.add(id)
}

export const moveHold = (id: number, lane: number) => {
    const index = holds.old.indexOf(id)
    if (index === -1) return

    const hold = holds.old.getValue(index)

    moveCircularHoldEffect(hold.effectInstanceIds.circular, lane)
    moveLinearHoldEffect(hold.effectInstanceIds.linear, lane)
}

export class HoldManager extends SpawnableArchetype({}) {
    updateSequential() {
        for (const [id, hold] of holds.old) {
            if (holds.queue.has(id)) {
                holds.now.set(id, hold)
            } else {
                stopHoldSFX(hold.clipInstanceId)
                destroyCircularHoldEffect(hold.effectInstanceIds.circular)
                destroyLinearHoldEffect(hold.effectInstanceIds.linear)
            }
        }

        for (const id of holds.queue) {
            if (holds.now.has(id)) continue

            holds.now.set(id, {
                clipInstanceId: playHoldSFX(),
                effectInstanceIds: {
                    circular: spawnCircularHoldEffect(),
                    linear: spawnLinearHoldEffect(),
                },
            })
        }

        holds.queue.clear()
        holds.now.copyTo(holds.old)
        holds.now.clear()
    }
}

const shouldPlay = {
    get holdSFX() {
        return options.sfxEnabled && effect.clips.hold.exists && !options.autoSFX
    },

    get circularHoldEffect() {
        return options.noteEffectEnabled && particle.effects.holdCircular.exists
    },

    get linearHoldEffect() {
        return options.noteEffectEnabled && particle.effects.holdLinear.exists
    },
}

const playHoldSFX = () => {
    if (!shouldPlay.holdSFX) return 0

    return effect.clips.hold.loop()
}

const spawnCircularHoldEffect = () => {
    if (!shouldPlay.circularHoldEffect) return 0

    return particle.effects.holdCircular.spawn(Quad.zero, 1, true)
}

const spawnLinearHoldEffect = () => {
    if (!shouldPlay.linearHoldEffect) return 0

    return particle.effects.holdLinear.spawn(Quad.zero, 1, true)
}

const moveCircularHoldEffect = (id: ParticleEffectInstanceId, lane: number) => {
    if (!shouldPlay.circularHoldEffect) return

    const layout = circularEffectLayout({
        lane,
        w: 0.9,
        h: 0.6,
    })

    particle.effects.move(id, layout)
}

const moveLinearHoldEffect = (id: ParticleEffectInstanceId, lane: number) => {
    if (!shouldPlay.linearHoldEffect) return

    const layout = linearEffectLayout({
        lane,
        size: 0.5,
    })

    particle.effects.move(id, layout)
}

const stopHoldSFX = (id: LoopedEffectClipInstanceId) => {
    if (!shouldPlay.holdSFX) return

    effect.clips.stopLoop(id)
}

const destroyCircularHoldEffect = (id: ParticleEffectInstanceId) => {
    if (!shouldPlay.circularHoldEffect) return

    particle.effects.destroy(id)
}

const destroyLinearHoldEffect = (id: ParticleEffectInstanceId) => {
    if (!shouldPlay.linearHoldEffect) return

    particle.effects.destroy(id)
}
