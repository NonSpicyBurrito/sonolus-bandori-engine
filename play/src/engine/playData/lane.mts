import { lane as _lane } from '../../../../shared/src/engine/data/lane.mjs'
import { skin } from './skin.mjs'

export const lane = {
    ..._lane,

    hitbox: {
        l: -3.5,
        r: 3.5,
        t: 0.5,
        b: 1.5,
    },
}

export const getHitbox = ({ l, r }: { l: number; r: number }) =>
    new Rect({
        l: l - 1.175,
        r: r + 1.175,
        b: lane.hitbox.b,
        t: lane.hitbox.t,
    }).transform(skin.transform)
