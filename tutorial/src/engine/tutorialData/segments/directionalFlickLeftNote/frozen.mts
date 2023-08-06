import { flickArrow } from '../../components/flickArrow.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'
import { drawHand, instruction } from '../../instruction.mjs'
import { segment } from '../../segment.mjs'

export const directionalFlickLeftNoteFrozen = {
    enter() {
        flickArrow.showFrozen('left')
        noteDisplay.showFrozen('directionalFlickLeftNote')

        instruction.texts.tapAndFlick.show()
    },

    update() {
        drawHand(
            Math.remapClamped(0.25, 0.5, Math.PI / 6, Math.PI / 3, segment.time.now % 1),
            Math.remapClamped(0.5, 0.75, 0, -0.5, segment.time.now % 1),
            0,
            Math.unlerpClamped(0.5, 0.25, Math.abs((segment.time.now % 1) - 0.5)),
        )
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()

        instruction.texts.clear()
    },
}
