import {
    Abs,
    Add,
    And,
    Code,
    GreaterOr,
    LessOr,
    Multiply,
    Subtract,
    TemporaryMemory,
    TouchX,
    TouchY,
} from 'sonolus.js'

import { laneWidth } from './constants'
import { updateTilt } from './stageTilt'

export const isTouchOccupied = TemporaryMemory.to<boolean>(0)

export function checkTouchXInLane(center: Code<number>) {
    return LessOr(Abs(Subtract(TouchX, center)), Multiply(laneWidth, 1.175))
}

export function checkTouchXInLanes(left: Code<number>, right: Code<number>) {
    return And(
        GreaterOr(TouchX, Subtract(left, Multiply(laneWidth, 1.175))),
        LessOr(TouchX, Add(right, Multiply(laneWidth, 1.175)))
    )
}

export function checkTouchYInHitBox() {
    return LessOr(TouchY, 0)
}

export function updateTouchTilt() {
    return updateTilt(TouchX)
}
