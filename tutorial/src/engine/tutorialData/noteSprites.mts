import { skin } from './skin.mjs'

export const noteSprites = {
    tapNote: {
        note: skin.sprites.tapNote,
    },
    flickNote: {
        note: skin.sprites.flickNote,
    },
    flickEndNote: {
        note: skin.sprites.flickEndNote,
    },
    directionalFlickLeftNote: {
        note: skin.sprites.directionalFlickLeftNote,
        fallback: skin.sprites.directionalFlickLeftNoteFallback,
    },
    directionalFlickRightNote: {
        note: skin.sprites.directionalFlickRightNote,
        fallback: skin.sprites.directionalFlickRightNoteFallback,
    },
    slideNote: {
        note: skin.sprites.slideNote,
    },
    slideEndNote: {
        note: skin.sprites.slideEndNote,
    },
}
