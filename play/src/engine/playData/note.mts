import { options } from '../configuration/options.mjs'

export const note = {
    h: 0.11625 / 2,

    approach(fromTime: number, toTime: number, now: number) {
        return Math.lerp(0.05, 1, 1.1 ** (50 * Math.remap(fromTime, toTime, -1, 0, now)))
    },

    get duration() {
        return options.noteSpeed <= 11
            ? (12 - options.noteSpeed) / 2
            : (16 - options.noteSpeed) / 10
    },
}
