import { EffectClipName } from 'sonolus-core'
import { lane } from '../../../../shared/src/engine/data/lane.mjs'
import {
    leftRotated,
    perspectiveLayout,
    rightRotated,
} from '../../../../shared/src/engine/data/utils.mjs'
import { particle } from './particle.mjs'
import { scaledScreen } from './scaledScreen.mjs'

export const effect = defineEffect({
    clips: {
        tapPerfect: EffectClipName.Perfect,

        flickPerfect: EffectClipName.PerfectAlternative,

        directionalFlickSingle: 'Bandori Directional Flick Single',

        hold: EffectClipName.Hold,
    },
})

const circularEffectLayout = ({ w, h }: { w: number; h: number }) => {
    const l = -w
    const r = w

    const b = 1 + h * scaledScreen.wToH
    const t = 1 - h * scaledScreen.wToH

    return new Rect({ l, r, b, t })
}

const linearEffectLayout = () =>
    new Rect({
        l: -0.5,
        r: 0.5,
        t: 1 - scaledScreen.wToH,
        b: 1,
    })

const leftRotatedLinearEffectLayout = () =>
    leftRotated({
        l: -1,
        r: 0,
        t: 1 - 0.5 * scaledScreen.wToH,
        b: 1 + 0.5 * scaledScreen.wToH,
    })

const rightRotatedLinearEffectLayout = () =>
    rightRotated({
        l: 0,
        r: 1,
        t: 1 - 0.5 * scaledScreen.wToH,
        b: 1 + 0.5 * scaledScreen.wToH,
    })

export const playLinearNoteEffect = (effect: ParticleEffect) =>
    effect.spawn(linearEffectLayout(), 0.4, false)

export const playLeftRotatedLinearNoteEffect = (effect: ParticleEffect) =>
    effect.spawn(leftRotatedLinearEffectLayout(), 0.4, false)

export const playRightRotatedLinearNoteEffect = (effect: ParticleEffect) =>
    effect.spawn(rightRotatedLinearEffectLayout(), 0.4, false)

export const playCircularNoteEffect = (effect: ParticleEffect) =>
    effect.spawn(circularEffectLayout({ w: 1.5, h: 1 }), 0.6, false)

export const playLaneEffects = () =>
    particle.effects.lane.spawn(
        perspectiveLayout({ l: -0.5, r: 0.5, b: lane.b, t: lane.t }),
        0.2,
        false,
    )

export const spawnCircularHoldEffect = () =>
    particle.effects.holdCircular.spawn(circularEffectLayout({ w: 0.9, h: 0.6 }), 1, true)

export const spawnLinearHoldEffect = () =>
    particle.effects.holdLinear.spawn(linearEffectLayout(), 1, true)
