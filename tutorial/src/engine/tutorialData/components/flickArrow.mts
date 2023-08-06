import { note } from '../../../../../shared/src/engine/data/note.mjs'
import { leftRotated, rightRotated } from '../../../../../shared/src/engine/data/utils.mjs'
import { scaledScreen } from '../scaledScreen.mjs'
import { segment } from '../segment.mjs'
import { layer, skin } from '../skin.mjs'

const arrowSprites = {
    up: {
        note: skin.sprites.flickArrow,
    },
    left: {
        note: skin.sprites.directionalFlickLeftArrow,
        fallback: skin.sprites.directionalFlickLeftArrowFallback,
    },
    right: {
        note: skin.sprites.directionalFlickRightArrow,
        fallback: skin.sprites.directionalFlickRightArrowFallback,
    },
}

let mode = tutorialMemory(DataType<0 | 1 | 2 | 3>)

let id = tutorialMemory(SkinSpriteId)
const overlay = tutorialMemory(Quad)
const layout = tutorialMemory(Quad)
const animation = tutorialMemory(Vec)

export const flickArrow = {
    update() {
        if (!mode) return

        if (mode === 1) {
            const a = Math.unlerpClamped(1, 0.75, segment.time.now)

            skin.sprites.draw(id, overlay, layer.note.arrow, a)
        } else {
            const y = mode === 2 ? note.approach(0, 2, segment.time.now) : 1
            const s = mode === 2 ? Math.lerp(-0.25, 0.25, Math.frac(segment.time.now * 3 + 0.5)) : 0

            skin.sprites.draw(id, layout.add(animation.mul(s)).mul(y), layer.note.arrow, 1)
        }
    },

    showOverlay(type: keyof typeof arrowSprites) {
        mode = 1
        this.setType(type)
        this.setOverlay(type)
    },

    showFall(type: keyof typeof arrowSprites) {
        mode = 2
        this.setType(type)
        this.setLayoutAndAnimation(type)
    },

    showFrozen(type: keyof typeof arrowSprites) {
        mode = 3
        this.setType(type)
        this.setLayoutAndAnimation(type)
    },

    clear() {
        mode = 0
    },

    setType(type: keyof typeof arrowSprites) {
        for (const [key, sprites] of Object.entries(arrowSprites)) {
            if (key !== type) continue

            if ('fallback' in sprites && !sprites.note.exists) {
                id = sprites.fallback.id
            } else {
                id = sprites.note.id
            }
        }
    },

    setOverlay(type: keyof typeof arrowSprites) {
        if (type === 'up') {
            const l = -1
            const r = 1

            const t = 0.5 - 2 * scaledScreen.wToH
            const b = 0.5

            new Rect({ l, r, b, t }).toQuad().copyTo(overlay)
        } else {
            const l = type === 'left' ? -2 : 0
            const r = type === 'left' ? 0 : 2

            const t = 0.5 - scaledScreen.wToH
            const b = 0.5 + scaledScreen.wToH

            if (type === 'left') {
                leftRotated({ l, r, b, t }).copyTo(overlay)
            } else {
                rightRotated({ l, r, b, t }).copyTo(overlay)
            }
        }
    },

    setLayoutAndAnimation(type: keyof typeof arrowSprites) {
        if (type === 'up') {
            const l = -0.5
            const r = 0.5

            const t = 1 - scaledScreen.wToH
            const b = 1

            new Rect({ l, r, b, t }).toQuad().copyTo(layout)
            new Vec({ x: 0, y: -scaledScreen.wToH }).copyTo(animation)
        } else {
            const l = type === 'left' ? -1 : 0
            const r = type === 'left' ? 0 : 1

            const t = 1 - 0.5 * scaledScreen.wToH
            const b = 1 + 0.5 * scaledScreen.wToH

            if (type === 'left') {
                leftRotated({ l, r, b, t }).copyTo(layout)
            } else {
                rightRotated({ l, r, b, t }).copyTo(layout)
            }

            new Vec({ x: type === 'left' ? -1 : 1, y: 0 }).copyTo(animation)
        }
    },
}
