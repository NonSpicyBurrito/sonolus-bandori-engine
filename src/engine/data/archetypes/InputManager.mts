const usedTouchIds = levelMemory(Collection(16, TouchId))

export const isUsed = (touch: Touch) => usedTouchIds.has(touch.id)

export const markAsUsed = (touch: Touch) => usedTouchIds.add(touch.id)

export class InputManager extends Archetype {
    touch() {
        usedTouchIds.clear()
    }
}
