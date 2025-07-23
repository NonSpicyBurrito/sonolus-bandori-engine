type Windows = {
    perfect: Range
    great: Range
    good: Range
}

export type DualWindows = {
    normal: Windows
    strict: Windows
}

export const toWindows = (dualWindows: DualWindows, strictJudgment: boolean) => {
    const toWindow = (key: 'perfect' | 'great' | 'good') =>
        new Range(
            strictJudgment ? dualWindows.strict[key].min : dualWindows.normal[key].min,
            strictJudgment ? dualWindows.strict[key].max : dualWindows.normal[key].max,
        )

    return {
        perfect: toWindow('perfect'),
        great: toWindow('great'),
        good: toWindow('good'),
    }
}

const toMs = ({ min, max }: Range) => new Range(Math.round(min * 1000), Math.round(max * 1000))

export const toBucketWindows = (windows: Windows) => ({
    perfect: toMs(windows.perfect),
    great: toMs(windows.great),
    good: toMs(windows.good),
})

type Seconds = number | [min: number, max: number]

const fromSeconds = (perfect: Seconds, great: Seconds, good: Seconds) => {
    const toWindow = (seconds: Seconds) =>
        typeof seconds === 'number' ? Range.one.mul(seconds) : new Range(...seconds)

    return {
        perfect: toWindow(perfect),
        great: toWindow(great),
        good: toWindow(good),
    }
}

export const windows = {
    tapNote: {
        normal: fromSeconds(0.05, 0.1, 0.15),
        strict: fromSeconds(0.05, 0.1, 0.15),
    },
    flickNote: {
        normal: fromSeconds(0.05, 0.1, 0.15),
        strict: fromSeconds(0.05, 0.1, 0.15),
    },
    directionalFlickNote: {
        normal: fromSeconds(0.05, 0.1, 0.15),
        strict: fromSeconds(0.05, 0.1, 0.15),
    },
    slideStartNote: {
        normal: fromSeconds(0.05, 0.1, 0.15),
        strict: fromSeconds(0.05, 0.1, 0.15),
    },
    slideTickNote: {
        normal: fromSeconds([0, 0.2], [0, 0.2], [0, 0.2]),
        strict: fromSeconds([0, 0.05], [0, 0.1], [0, 0.15]),
    },
    slideEndNote: {
        normal: fromSeconds([-0.05, 0.2], [-0.1, 0.2], [-0.15, 0.2]),
        strict: fromSeconds(0.05, 0.1, 0.15),
    },
    slideEndFlickNote: {
        normal: fromSeconds([-0.05, 0.2], [-0.1, 0.2], [-0.15, 0.2]),
        strict: fromSeconds(0.05, 0.1, 0.15),
    },

    minGood: -0.15,
}
