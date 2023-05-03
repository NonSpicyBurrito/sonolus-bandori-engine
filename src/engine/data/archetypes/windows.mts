type Seconds = number | [min: number, max: number]

const fromSeconds = (perfect: Seconds, great: Seconds, good: Seconds) => {
    const toWindow = (seconds: Seconds) =>
        typeof seconds === 'number'
            ? { min: -seconds, max: seconds }
            : { min: seconds[0], max: seconds[1] }

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
