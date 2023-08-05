import { options } from '../../configuration/options.mjs'
import { skin } from '../skin.mjs'
import { lane } from './lane.mjs'
import { scaledScreen } from './scaledScreen.mjs'

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

export const circularEffectLayout = ({ lane, w, h }: { lane: number; w: number; h: number }) => {
    w *= options.noteEffectSize
    h *= options.noteEffectSize * scaledScreen.wToH

    return new Rect({
        l: lane - w,
        r: lane + w,
        t: 1 - h,
        b: 1 + h,
    })
}

export const linearEffectLayout = ({ lane, size }: { lane: number; size: number }) => {
    const w = size * options.noteEffectSize
    const h = 2 * size * options.noteEffectSize * scaledScreen.wToH

    return new Rect({
        l: lane - w,
        r: lane + w,
        t: 1 - h,
        b: 1,
    })
}

export const getHitbox = ({ l, r }: { l: number; r: number }) =>
    new Rect({
        l: l - 1.175,
        r: r + 1.175,
        b: lane.hitbox.b,
        t: lane.hitbox.t,
    }).transform(skin.transform)

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000

export const getScheduleSFXTime = (targetTime: number) =>
    targetTime - 0.5 - Math.max(audio.offset, 0)
