import { SkinSpriteName } from 'sonolus-core'
import { note } from './note.mjs'
import { panel } from './panel.mjs'

export const skin = defineSkin({
    sprites: {
        lane: SkinSpriteName.Lane,
        laneAlternative: SkinSpriteName.LaneAlternative,
        stageLeftBorder: SkinSpriteName.StageLeftBorder,
        stageRightBorder: SkinSpriteName.StageRightBorder,

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

        beatLine: SkinSpriteName.GridNeutral,
        bpmChangeLine: SkinSpriteName.GridPurple,
    },
})

export const layer = {
    note: {
        arrow: 101,
        body: 100,
        connector: 99,
    },

    simLine: 90,

    line: 10,

    stage: 0,
}

export const line = (sprite: SkinSprite, beat: number, a: number) => {
    const position = panel.positionFromTime(bpmChanges.at(beat).time)

    sprite.draw(
        new Rect({
            l: -3.5,
            r: 3.5,
            b: -note.h / 5,
            t: note.h / 5,
        }).add(position),
        layer.line,
        a,
    )
}

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000
