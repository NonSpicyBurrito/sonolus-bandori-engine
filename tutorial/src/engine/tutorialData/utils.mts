import { lane } from './constants.mjs'
import { instruction } from './instruction.mjs'
import { particle } from './particle.mjs'
import { hand, scaledScreen } from './shared.mjs'

export const leftRotated = ({ l, r, b, t }: RectLike) =>
    new Quad({
        x1: r,
        x2: l,
        x3: l,
        x4: r,
        y1: b,
        y2: b,
        y3: t,
        y4: t,
    })

export const rightRotated = ({ l, r, b, t }: RectLike) =>
    new Quad({
        x1: l,
        x2: r,
        x3: r,
        x4: l,
        y1: t,
        y2: t,
        y3: b,
        y4: b,
    })

export const perspectiveLayout = ({ l, r, b, t }: RectLike) =>
    new Quad({
        x1: l * b,
        x2: l * t,
        x3: r * t,
        x4: r * b,
        y1: b,
        y2: t,
        y3: t,
        y4: b,
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

export const approach = (now: number) =>
    Math.lerp(0.05, 1, 1.1 ** (50 * Math.remap(0, 2, -1, 0, now)))

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

export const drawHand = (angle: number, x: number, y: number, a: number) =>
    instruction.icons.hand.paint(
        new Vec(0, 1)
            .rotate(angle)
            .mul(0.25 * ui.configuration.instruction.scale)
            .add(hand.position)
            .translate(x, y),
        0.25 * ui.configuration.instruction.scale,
        (180 * angle) / Math.PI,
        0,
        a * ui.configuration.instruction.alpha,
    )
