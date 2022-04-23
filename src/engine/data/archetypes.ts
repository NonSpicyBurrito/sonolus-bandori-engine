import { defineArchetypes } from 'sonolus.js'
import { scripts } from './scripts'

export const archetypes = defineArchetypes({
    initialization: scripts.initializationIndex,
    stage: scripts.stageIndex,
    tapNote: {
        script: scripts.tapNoteIndex,
        input: true,
    },
    flickNote: {
        script: scripts.flickNoteIndex,
        input: true,
    },
    directionalFlickNote: {
        script: scripts.directionalFlickNoteIndex,
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
    straightSlider: scripts.straightSliderIndex,
    curvedSlider: scripts.curvedSliderIndex,
})
