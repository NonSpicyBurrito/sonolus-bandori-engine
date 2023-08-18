import { approach, note } from '../../../../../shared/src/engine/data/note.mjs'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.mjs'
import { segment } from '../segment.mjs'
import { layer, skin } from '../skin.mjs'

const sprites = {
    connector: skin.sprites.straightSlideConnector,
}

let mode = tutorialMemory(DataType<0 | 1 | 2 | 3 | 4 | 5>)

export const connector = {
    update() {
        if (!mode) return

        if (mode === 1 || mode === 2) {
            const a = 0.8 * Math.unlerpClamped(1, 0.75, segment.time.now)

            const l = -1
            const r = 1

            const t = 0.5 - (mode === 1 ? note.h * 6 : 0)
            const b = 0.5 + (mode === 2 ? note.h * 6 : 0)

            const layout = new Rect({ l, r, t, b })

            sprites.connector.draw(layout, layer.note.connector, a)
        } else {
            const t = approach(0, 2, mode === 4 ? segment.time.now : 0)
            const b = approach(0, 2, mode === 3 ? segment.time.now : 2)

            const layout = perspectiveLayout({ l: -0.5, r: 0.5, b, t })

            sprites.connector.draw(layout, layer.note.connector, 0.8)
        }
    },

    showOverlayIn() {
        mode = 1
    },

    showOverlayOut() {
        mode = 2
    },

    showFallIn() {
        mode = 3
    },

    showFallOut() {
        mode = 4
    },

    showFrozen() {
        mode = 5
    },

    clear() {
        mode = 0
    },
}
