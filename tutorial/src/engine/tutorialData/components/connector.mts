import { note } from '../constants.mjs'
import { layer } from '../layer.mjs'
import { segment } from '../shared.mjs'
import { skin } from '../skin.mjs'
import { approach, perspectiveLayout } from '../utils.mjs'

const sprites = {
    connector: skin.sprites.straightSlideConnector,
}

let mode = tutorialMemory(DataType<0 | 1 | 2 | 3 | 4 | 5>)

export const connector = {
    update() {
        if (!mode) return

        if (mode === 1 || mode === 2) {
            const a = 0.8 * Math.unlerpClamped(1, 0.75, segment.time)

            const l = -1
            const r = 1

            const t = 0.5 - (mode === 1 ? note.h * 6 : 0)
            const b = 0.5 + (mode === 2 ? note.h * 6 : 0)

            const layout = new Rect({ l, r, t, b })

            sprites.connector.draw(layout, layer.note.connector, a)
        } else {
            const t = approach(mode === 4 ? segment.time : 0) // t 0 0
            const b = approach(mode === 3 ? segment.time : 2) // 2 t 2

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
