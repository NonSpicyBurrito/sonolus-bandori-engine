import { SkinSpriteName } from '@sonolus/core'

export const skin = defineSkin({
    renderMode: 'lightweight',
    sprites: {
        cover: SkinSpriteName.StageCover,

        lane: SkinSpriteName.Lane,
        laneAlternative: SkinSpriteName.LaneAlternative,
        stageLeftBorder: SkinSpriteName.StageLeftBorder,
        stageRightBorder: SkinSpriteName.StageRightBorder,
        judgmentLine: SkinSpriteName.JudgmentLine,
        slot: SkinSpriteName.NoteSlot,

        bandoriStage: 'Bandori Stage',
        bandoriJudgmentLine: 'Bandori Judgment Line',

        simLine: SkinSpriteName.SimultaneousConnectionNeutral,

        tapNote: SkinSpriteName.NoteHeadCyan,

        flickNote: SkinSpriteName.NoteHeadRed,
        flickEndNote: SkinSpriteName.NoteTailRed,
        flickArrow: SkinSpriteName.DirectionalMarkerRed,

        directionalFlickLeftNote: 'Bandori Directional Flick Note Left',
        directionalFlickLeftArrow: 'Bandori Directional Flick Marker Left',
        directionalFlickLeftNoteFallback: SkinSpriteName.NoteHeadPurple,
        directionalFlickLeftArrowFallback: SkinSpriteName.DirectionalMarkerPurple,

        directionalFlickRightNote: 'Bandori Directional Flick Note Right',
        directionalFlickRightArrow: 'Bandori Directional Flick Marker Right',
        directionalFlickRightNoteFallback: SkinSpriteName.NoteHeadYellow,
        directionalFlickRightArrowFallback: SkinSpriteName.DirectionalMarkerYellow,

        slideNote: SkinSpriteName.NoteHeadGreen,
        slideEndNote: SkinSpriteName.NoteTailGreen,

        tickNote: SkinSpriteName.NoteTickGreen,

        straightSlideConnector: SkinSpriteName.NoteConnectionGreen,
        curvedSlideConnector: SkinSpriteName.NoteConnectionGreenSeamless,
    },
})

export const layer = {
    cover: 1000,

    note: {
        arrow: 101,
        body: 100,
        slide: 99,
        connector: 98,
    },

    simLine: 90,

    slot: 2,
    judgmentLine: 1,
    stage: 0,
}

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000
