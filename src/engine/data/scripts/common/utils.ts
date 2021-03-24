import { Add, Code, Multiply, Subtract } from 'sonolus.js'

export function getDistanceSquared(
    x1: Code<number>,
    y1: Code<number>,
    x2: Code<number>,
    y2: Code<number>
) {
    return Add(
        Multiply(Subtract(x1, x2), Subtract(x1, x2)),
        Multiply(Subtract(y1, y2), Subtract(y1, y2))
    )
}
