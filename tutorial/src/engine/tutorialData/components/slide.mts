import { note } from '../../../../../shared/src/engine/data/note.mjs'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.mjs'
import { layer, skin } from '../skin.mjs'

const sprites = {
    slide: skin.sprites.slideNote,
}

let mode = tutorialMemory(Boolean)

export const slide = {
    update() {
        if (!mode) return

        const l = -0.5
        const r = 0.5

        const t = 1 - note.h
        const b = 1 + note.h

        sprites.slide.draw(perspectiveLayout({ l, r, t, b }), layer.note.slide, 1)
    },

    show() {
        mode = true
    },

    clear() {
        mode = false
    },
}
