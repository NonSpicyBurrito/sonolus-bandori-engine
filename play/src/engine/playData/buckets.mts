import { Text } from 'sonolus-core'
import { skin } from './skin.mjs'

export const buckets = defineBuckets({
    tapNote: {
        sprites: [
            {
                id: skin.sprites.tapNote.id,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
        unit: Text.MillisecondUnit,
    },
    flickNote: {
        sprites: [
            {
                id: skin.sprites.flickNote.id,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
            {
                id: skin.sprites.flickArrow.id,
                x: 1,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
        unit: Text.MillisecondUnit,
    },
    directionalFlickNote: {
        sprites: [
            {
                id: skin.sprites.directionalFlickLeftNote.id,
                fallbackId: skin.sprites.directionalFlickLeftNoteFallback.id,
                x: -2,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0,
            },
            {
                id: skin.sprites.directionalFlickRightNote.id,
                fallbackId: skin.sprites.directionalFlickRightNoteFallback.id,
                x: 2,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0,
            },
            {
                id: skin.sprites.directionalFlickLeftArrow.id,
                fallbackId: skin.sprites.directionalFlickLeftArrowFallback.id,
                x: -3,
                y: 0,
                w: 2,
                h: 2,
                rotation: 90,
            },
            {
                id: skin.sprites.directionalFlickRightArrow.id,
                fallbackId: skin.sprites.directionalFlickRightArrowFallback.id,
                x: 3,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
        unit: Text.MillisecondUnit,
    },
    slideStartNote: {
        sprites: [
            {
                id: skin.sprites.straightSlideConnector.id,
                x: 0.5,
                y: 0,
                w: 2,
                h: 5,
                rotation: -90,
            },
            {
                id: skin.sprites.slideNote.id,
                x: -2,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
        unit: Text.MillisecondUnit,
    },
    slideTickNote: {
        sprites: [
            {
                id: skin.sprites.straightSlideConnector.id,
                x: 0,
                y: 0,
                w: 2,
                h: 6,
                rotation: -90,
            },
            {
                id: skin.sprites.tickNote.id,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
        unit: Text.MillisecondUnit,
    },
    slideEndNote: {
        sprites: [
            {
                id: skin.sprites.straightSlideConnector.id,
                x: -0.5,
                y: 0,
                w: 2,
                h: 5,
                rotation: -90,
            },
            {
                id: skin.sprites.slideEndNote.id,
                x: 2,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
        unit: Text.MillisecondUnit,
    },
    slideEndFlickNote: {
        sprites: [
            {
                id: skin.sprites.straightSlideConnector.id,
                x: -0.5,
                y: 0,
                w: 2,
                h: 5,
                rotation: -90,
            },
            {
                id: skin.sprites.flickEndNote.id,
                x: 2,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
            {
                id: skin.sprites.flickArrow.id,
                x: 3,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90,
            },
        ],
        unit: Text.MillisecondUnit,
    },
})
