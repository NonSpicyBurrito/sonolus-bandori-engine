import {
    And,
    Code,
    GreaterOr,
    LessOr,
    LevelMemory,
    Multiply,
    TouchX,
    TouchY,
} from 'sonolus.js'
import { stageWidth } from './constants'

export const isTouchOccupied = LevelMemory.to<boolean>(1)

export function checkTouchXInHitbox(left: Code<number>, right: Code<number>) {
    return And(GreaterOr(TouchX, left), LessOr(TouchX, right))
}

export function checkTouchYInHitbox() {
    return LessOr(TouchY, 0)
}

export function getMinFlickDistanceSquared(ratio: Code<number>) {
    return Multiply(ratio, ratio, stageWidth, stageWidth)
}
