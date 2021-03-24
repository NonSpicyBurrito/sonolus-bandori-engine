import { Add, Code, Multiply, Subtract } from 'sonolus.js'

import { laneWidth } from './constants'

export function getLaneTopLeft(lane: Code<number>) {
    return Multiply(0.05, laneWidth, Subtract(lane, 0.5))
}

export function getLaneTopRight(lane: Code<number>) {
    return Multiply(0.05, laneWidth, Add(lane, 0.5))
}

export function getLaneBottomLeft(lane: Code<number>) {
    return Multiply(laneWidth, Subtract(lane, 0.5))
}

export function getLaneBottomRight(lane: Code<number>) {
    return Multiply(laneWidth, Add(lane, 0.5))
}

export function getLaneBottomCenter(lane: Code<number>) {
    return Multiply(laneWidth, lane)
}
