import { SkinSprite } from 'sonolus-core'
import { defineBuckets } from 'sonolus.js'
import {
    BandoriLeftDirectionalFlickMarkerSprite,
    BandoriLeftDirectionalFlickNoteSprite,
    BandoriRightDirectionalFlickMarkerSprite,
    BandoriRightDirectionalFlickNoteSprite,
} from './scripts/common/constants'

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
    leftDirectionalFlickNote: {
        sprites: [
            {
                id: BandoriLeftDirectionalFlickNoteSprite,
                fallbackId: SkinSprite.NoteHeadPurple,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0,
            },
            {
                id: BandoriLeftDirectionalFlickMarkerSprite,
                fallbackId: SkinSprite.DirectionalMarkerPurple,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0,
            },
        ],
    },
    rightDirectionalFlickNote: {
        sprites: [
            {
                id: BandoriRightDirectionalFlickNoteSprite,
                fallbackId: SkinSprite.NoteHeadYellow,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: 180,
            },
            {
                id: BandoriRightDirectionalFlickMarkerSprite,
                fallbackId: SkinSprite.DirectionalMarkerYellow,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: 180,
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
