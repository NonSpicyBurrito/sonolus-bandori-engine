import { skin } from './skin.mjs'

export const lane = {
    t: 0.05,
    b: 1,

    hitbox: {
        l: -3.5,
        r: 3.5,
        t: 0.5,
        b: 1.5,

        get({ l, r }: { l: number; r: number }) {
            return new Rect({
                l: l - 1.175,
                r: r + 1.175,
                b: this.b,
                t: this.t,
            }).transform(skin.transform)
        },
    },
}
