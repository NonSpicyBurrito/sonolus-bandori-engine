import { flickArrow } from '../../components/flickArrow.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'
import { drawHand, instruction } from '../../instruction.mjs'
import { segment } from '../../segment.mjs'

export const slideEndFlickNoteFrozen = {
    enter() {
        flickArrow.showFrozen('up')
        noteDisplay.showFrozen('flickEndNote')

        instruction.texts.flick.show()
    },

    update() {
        drawHand(
            Math.PI / 3,
            0,
            Math.remapClamped(0.25, 0.75, 0, 0.5, segment.time.now % 1),
            Math.unlerpClamped(1, 0.75, segment.time.now % 1),
        )
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()

        instruction.texts.clear()
    },
}
