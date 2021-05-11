import {
    And,
    Code,
    GreaterOr,
    LessOr,
    TemporaryMemory,
    TouchX,
    TouchY,
} from 'sonolus.js'

import { updateTilt } from './stageTilt'

export const isTouchOccupied = TemporaryMemory.to<boolean>(0)

export function checkTouchXInHitbox(left: Code<number>, right: Code<number>) {
    return And(GreaterOr(TouchX, left), LessOr(TouchX, right))
}

export function checkTouchYInHitbox() {
    return LessOr(TouchY, 0)
}

export function updateTouchTilt() {
    return updateTilt(TouchX)
}
