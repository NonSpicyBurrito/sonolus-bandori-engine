import { note } from '../constants.mjs'
import { layer } from '../layer.mjs'
import { skin } from '../skin.mjs'
import { perspectiveLayout } from '../utils.mjs'

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
