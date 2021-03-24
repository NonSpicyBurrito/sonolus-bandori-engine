import {
    Abs,
    Code,
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

export function checkTouchYInHitBox() {
    return LessOr(TouchY, 0)
}

export function updateTouchTilt() {
    return updateTilt(TouchX)
}
