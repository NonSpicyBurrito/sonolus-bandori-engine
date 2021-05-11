import { defineArchetypes } from 'sonolus.js'

import { scripts } from './scripts'

export const archetypes = defineArchetypes({
    initialization: {
        script: scripts.initializationIndex,
    },
    stage: {
        script: scripts.stageIndex,
    },
    tapNote: {
        script: scripts.tapNoteIndex,
        input: true,
    },
    flickNote: {
        script: scripts.flickNoteIndex,
        input: true,
    },
    leftDirectionalFlickNote: {
        script: scripts.leftDirectionalFlickNoteIndex,
        input: true,
    },
    rightDirectionalFlickNote: {
        script: scripts.rightDirectionalFlickNoteIndex,
        input: true,
    },
    slideStartNote: {
        script: scripts.slideStartNoteIndex,
        input: true,
    },
    slideTickNote: {
        script: scripts.slideTickNoteIndex,
        input: true,
    },
    slideEndNote: {
        script: scripts.slideEndNoteIndex,
        input: true,
    },
    slideFlickNote: {
        script: scripts.slideFlickNoteIndex,
        input: true,
    },
    straightSlider: {
        script: scripts.straightSliderIndex,
    },
    curvedSlider: {
        script: scripts.curvedSliderIndex,
    },
})
