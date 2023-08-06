import { connector } from '../../components/connector.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'
import { drawHand, instruction } from '../../instruction.mjs'
import { segment } from '../../segment.mjs'

export const slideStartNoteFrozen = {
    enter() {
        noteDisplay.showFrozen('slideNote')
        connector.showFrozen()

        instruction.texts.tapAndHold.show()
    },

    update() {
        drawHand(
            Math.remapClamped(0.25, 0.75, Math.PI / 6, Math.PI / 3, segment.time.now % 1),
            0,
            0,
            Math.unlerpClamped(0, 0.25, segment.time.now % 1),
        )
    },

    exit() {
        noteDisplay.clear()
        connector.clear()

        instruction.texts.clear()
    },
}
