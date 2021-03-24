import { defineBuckets, SkinSprite } from 'sonolus.js'

export const buckets = defineBuckets({
    tapNote: {
        sprites: [
            {
                id: SkinSprite.NoteHeadCyan,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
    },
    flickNote: {
        sprites: [
            {
                id: SkinSprite.NoteHeadRed,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
            {
                id: SkinSprite.DirectionalMarkerRed,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
    },
    slideStartNote: {
        sprites: [
            {
                id: SkinSprite.NoteConnectionGreen,
                x: 0.5,
                y: 0,
                w: 2,
                h: 5,
                rotation: -90,
            },
            {
                id: SkinSprite.NoteHeadGreen,
                x: -2,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
    },
    slideTickNote: {
        sprites: [
            {
                id: SkinSprite.NoteConnectionGreen,
                x: 0,
                y: 0,
                w: 2,
                h: 6,
                rotation: -90,
            },
            {
                id: SkinSprite.NoteTickGreen,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
    },
    slideEndNote: {
        sprites: [
            {
                id: SkinSprite.NoteConnectionGreen,
                x: -0.5,
                y: 0,
                w: 2,
                h: 5,
                rotation: -90,
            },
            {
                id: SkinSprite.NoteHeadGreen,
                x: 2,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
    },
    slideFlickNote: {
        sprites: [
            {
                id: SkinSprite.NoteConnectionGreen,
                x: -0.5,
                y: 0,
                w: 2,
                h: 5,
                rotation: -90,
            },
            {
                id: SkinSprite.NoteHeadRed,
                x: 2,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
            {
                id: SkinSprite.DirectionalMarkerRed,
                x: 2,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
    },
})
