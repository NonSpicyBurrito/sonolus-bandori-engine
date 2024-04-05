import { EngineDataBucket, Text } from '@sonolus/core'

export const createBucketDefinition = (
    sprites: Record<
        | 'tapNote'
        | 'flickNote'
        | 'flickEndNote'
        | 'flickArrow'
        | 'directionalFlickLeftNote'
        | 'directionalFlickLeftArrow'
        | 'directionalFlickLeftNoteFallback'
        | 'directionalFlickLeftArrowFallback'
        | 'directionalFlickRightNote'
        | 'directionalFlickRightArrow'
        | 'directionalFlickRightNoteFallback'
        | 'directionalFlickRightArrowFallback'
        | 'slideNote'
        | 'slideEndNote'
        | 'tickNote'
        | 'straightSlideConnector',
        { id: number }
    >,
) =>
    ({
        tapNote: {
            sprites: [
                {
                    id: sprites.tapNote.id,
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
                    id: sprites.flickNote.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: -90,
                },
                {
                    id: sprites.flickArrow.id,
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
                    id: sprites.directionalFlickLeftNote.id,
                    fallbackId: sprites.directionalFlickLeftNoteFallback.id,
                    x: -2,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
                {
                    id: sprites.directionalFlickRightNote.id,
                    fallbackId: sprites.directionalFlickRightNoteFallback.id,
                    x: 2,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
                {
                    id: sprites.directionalFlickLeftArrow.id,
                    fallbackId: sprites.directionalFlickLeftArrowFallback.id,
                    x: -3,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 90,
                },
                {
                    id: sprites.directionalFlickRightArrow.id,
                    fallbackId: sprites.directionalFlickRightArrowFallback.id,
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
                    id: sprites.straightSlideConnector.id,
                    x: 0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.slideNote.id,
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
                    id: sprites.straightSlideConnector.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 6,
                    rotation: -90,
                },
                {
                    id: sprites.tickNote.id,
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
                    id: sprites.straightSlideConnector.id,
                    x: -0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.slideEndNote.id,
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
                    id: sprites.straightSlideConnector.id,
                    x: -0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.flickEndNote.id,
                    x: 2,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: -90,
                },
                {
                    id: sprites.flickArrow.id,
                    x: 3,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: -90,
                },
            ],
            unit: Text.MillisecondUnit,
        },
    }) as const satisfies Record<string, EngineDataBucket>
