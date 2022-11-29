import { customEffectClip, customSkinSprite, SkinSprite } from 'sonolus-core'
import {
    Add,
    And,
    Divide,
    Greater,
    HasEffectClip,
    HasSkinSprite,
    If,
    Lerp,
    LessOr,
    Multiply,
    ScreenAspectRatio,
    Subtract,
    Unlerp,
} from 'sonolus.js'
import { options } from '../../../configuration/options'

// Engine

const engineId = 1

// Input

export const perfectWindow = 0.05
export const greatWindow = 0.1
export const goodWindow = 0.15
export const slideWindow = 0.2

// SFX

export const minSFXDistance = 0.02

// Directional Flick SFX

export const singleDirectionalFlickClip = customEffectClip(engineId, 1)
export const doubleDirectionalFlickClip = customEffectClip(engineId, 2)
export const tripleDirectionalFlickClip = customEffectClip(engineId, 3)

export const hasDirectionalFlickClips = And(
    HasEffectClip(singleDirectionalFlickClip),
    HasEffectClip(doubleDirectionalFlickClip),
    HasEffectClip(tripleDirectionalFlickClip)
)

// Layers

export enum Layer {
    Cover = 1000,
    NoteMarker = 101,
    NoteBody = 100,
    NoteSlide = 99,
    NoteConnector = 98,
    SimLine = 97,
    Slot = 3,
    JudgmentLine = 2,
    Stage = 0,
}

// Screen

export const screenHeight = 2
export const screenWidth = Multiply(ScreenAspectRatio, screenHeight)

export const screenBottom = -1
export const screenTop = 1
export const screenLeft = Multiply(-1, ScreenAspectRatio)
export const screenRight = ScreenAspectRatio

// Stage

const targetAspectRatio = 1334 / 750
const lowPosition = 0.82
const highPosition = 0.78125

export const stageWidth = If(
    options.isStageAspectRatioLocked,
    If(
        Greater(ScreenAspectRatio, targetAspectRatio),
        ((screenHeight * highPosition) / lowPosition) * targetAspectRatio,
        screenWidth
    ),
    screenWidth
)
export const stageHeight = If(
    options.isStageAspectRatioLocked,
    If(
        Greater(ScreenAspectRatio, targetAspectRatio),
        screenHeight * highPosition,
        Multiply(Divide(screenWidth, targetAspectRatio), lowPosition)
    ),
    If(
        Greater(ScreenAspectRatio, targetAspectRatio),
        screenHeight * highPosition,
        screenHeight * lowPosition
    )
)

export const stageBottom = If(
    options.isStageAspectRatioLocked,
    If(
        Greater(ScreenAspectRatio, targetAspectRatio),
        screenTop - screenHeight * highPosition,
        Multiply(Divide(screenWidth, targetAspectRatio), 0.5 - lowPosition)
    ),
    If(
        Greater(ScreenAspectRatio, targetAspectRatio),
        screenTop - screenHeight * highPosition,
        screenTop - screenHeight * lowPosition
    )
)
export const stageTop = If(
    options.isStageAspectRatioLocked,
    If(
        Greater(ScreenAspectRatio, targetAspectRatio),
        screenTop,
        Multiply(Divide(screenWidth, targetAspectRatio), 0.5)
    ),
    screenTop
)

export const laneWidth = Divide(stageWidth, 2, 4.375)
export const laneBottom = stageBottom
export const laneTop = Lerp(stageTop, stageBottom, 0.05)

// Stage with Bandori sprites

export const BandoriStageSprite = customSkinSprite(engineId, 1)
export const BandoriJudgmentLineSprite = customSkinSprite(engineId, 2)

export const bandoriStageWidth = Multiply(stageWidth, 0.865)
export const bandoriStageBottom = stageBottom
export const bandoriStageTop = Lerp(stageTop, stageBottom, 0.015)

export const bandoriJudgmentLineWidth = Multiply(stageWidth, 1.335)
export const bandoriJudgmentLineHeight = Multiply(
    bandoriJudgmentLineWidth,
    90 / 1800
)

// Note

export const baseNoteWidth = laneWidth
export const baseNoteHeight = Multiply(stageHeight, 0.11625)

export const halfBaseNoteWidth = Multiply(baseNoteWidth, 0.5)
export const halfBaseNoteHeight = Multiply(baseNoteHeight, 0.5)

export const noteWidth = Multiply(baseNoteWidth, options.noteSize)
export const noteHeight = Multiply(baseNoteHeight, options.noteSize)

export const halfNoteWidth = Multiply(noteWidth, 0.5)
export const halfNoteHeight = Multiply(noteHeight, 0.5)

export const noteBaseBottom = Subtract(laneBottom, halfNoteHeight)
export const noteBaseTop = Add(laneBottom, halfNoteHeight)
export const noteBaseBottomScale = Unlerp(stageTop, stageBottom, noteBaseBottom)
export const noteBaseTopScale = Unlerp(stageTop, stageBottom, noteBaseTop)

export const noteOnScreenDuration = If(
    LessOr(options.noteSpeed, 11),
    Divide(Subtract(12, options.noteSpeed), 2),
    Divide(Subtract(16, options.noteSpeed), 10)
)

// Note with Bandori Sprites

export const BandoriLeftDirectionalFlickNoteSprite = customSkinSprite(
    engineId,
    11
)
export const BandoriRightDirectionalFlickNoteSprite = customSkinSprite(
    engineId,
    12
)

export const BandoriLeftDirectionalFlickMarkerSprite = customSkinSprite(
    engineId,
    21
)
export const BandoriRightDirectionalFlickMarkerSprite = customSkinSprite(
    engineId,
    22
)

export const leftDirectionalFlickNoteSprite = If(
    HasSkinSprite(BandoriLeftDirectionalFlickNoteSprite),
    BandoriLeftDirectionalFlickNoteSprite,
    SkinSprite.NoteHeadPurple
)
export const rightDirectionalFlickNoteSprite = If(
    HasSkinSprite(BandoriRightDirectionalFlickNoteSprite),
    BandoriRightDirectionalFlickNoteSprite,
    SkinSprite.NoteHeadYellow
)

export const leftDirectionalFlickMarkerSprite = If(
    HasSkinSprite(BandoriLeftDirectionalFlickMarkerSprite),
    BandoriLeftDirectionalFlickMarkerSprite,
    SkinSprite.DirectionalMarkerPurple
)
export const rightDirectionalFlickMarkerSprite = If(
    HasSkinSprite(BandoriRightDirectionalFlickMarkerSprite),
    BandoriRightDirectionalFlickMarkerSprite,
    SkinSprite.DirectionalMarkerYellow
)

// Slot Effect

export const halfSlotEffectSize = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize
)

// Tap Effect

export const halfLinearTapEffectSize = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize
)

export const halfCircularTapEffectWidth = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize,
    3
)
export const halfCircularTapEffectHeight = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize,
    2
)

// Hold Effect

export const halfLinearHoldEffectSize = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize
)

export const halfCircularHoldEffectWidth = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize,
    1.8
)
export const halfCircularHoldEffectHeight = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize,
    1.2
)
