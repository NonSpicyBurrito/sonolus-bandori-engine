import { SkinSpriteName } from 'sonolus-core'

export const skin = defineSkin({
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

        tickNote: SkinSpriteName.NoteTickGreen,

        straightSlideConnector: SkinSpriteName.NoteConnectionGreen,
        curvedSlideConnector: SkinSpriteName.NoteConnectionGreenSeamless,
    },
})
