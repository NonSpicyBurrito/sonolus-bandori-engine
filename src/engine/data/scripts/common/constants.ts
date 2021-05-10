import {
    Add,
    DeviceInputOffset,
    Divide,
    GreaterOr,
    If,
    Multiply,
    ScreenAspectRatio,
    Subtract,
} from 'sonolus.js'

import { options } from '../../../configuration/options'

// Audio

export const audioOffset = Divide(options.levelAudioOffset, 1000)

// Input

export const perfectWindow = 0.05
export const greatWindow = 0.1
export const goodWindow = 0.15
export const slideWindow = 0.2

export const inputOffset = Add(
    DeviceInputOffset,
    Divide(options.levelInputOffset, 1000)
)

// SFX

export const minSFXDistance = 0.02

// Layers

export const layerCover = 1000
export const layerNoteMarker = 101
export const layerNoteBody = 100
export const layerNoteSlide = 99
export const layerNoteConnector = 98
export const layerSimLine = 97
export const layerSlot = 3
export const layerJudgmentLine = 2
export const layerStage = 0

// Screen

export const screenLeft = Multiply(-1, ScreenAspectRatio)
export const screenRight = ScreenAspectRatio

// Stage

const targetAspectRatio = 16 / 9

export const stageWidth = If(
    options.isStageAspectRatioLocked,
    If(
        GreaterOr(ScreenAspectRatio, targetAspectRatio),
        targetAspectRatio * 2,
        Multiply(ScreenAspectRatio, 2)
    ),
    Multiply(ScreenAspectRatio, 2)
)
export const stageHeight = If(
    options.isStageAspectRatioLocked,
    If(
        GreaterOr(ScreenAspectRatio, targetAspectRatio),
        2,
        Divide(ScreenAspectRatio, targetAspectRatio, 0.5)
    ),
    2
)

export const laneWidth = Divide(stageWidth, 2, 4.375)
export const laneYOffset = Divide(stageHeight, 2)
export const laneYMultiplier = Divide(stageHeight, -1.225)
export const laneBottom = Add(laneYOffset, laneYMultiplier)
export const laneTop = Add(laneYOffset, Multiply(laneYMultiplier, 0.05))

export const minFlickDistanceSquared = Multiply(
    0.04,
    0.04,
    stageWidth,
    stageWidth
)

// Note

export const baseNoteWidth = laneWidth
export const baseNoteHeight = Multiply(stageHeight, 0.08571)

export const halfBaseNoteWidth = Multiply(baseNoteWidth, 0.5)
export const halfBaseNoteHeight = Multiply(baseNoteHeight, 0.5)

export const noteWidth = Multiply(baseNoteWidth, options.noteSize)
export const noteHeight = Multiply(baseNoteHeight, options.noteSize)

export const halfNoteWidth = Multiply(noteWidth, 0.5)
export const halfNoteHeight = Multiply(noteHeight, 0.5)

export const noteBaseBottom = Subtract(
    1,
    Divide(halfNoteHeight, laneYMultiplier)
)
export const noteBaseTop = Add(1, Divide(halfNoteHeight, laneYMultiplier))

export const noteOnScreenDuration = Divide(Subtract(12, options.noteSpeed), 2)

// Slot Effect

export const halfSlotEffectWidth = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize
)

// Tap Effect

export const halfLinearTapEffectWidth = Multiply(
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

export const halfLinearHoldEffectWidth = Multiply(
    halfBaseNoteWidth,
    options.noteEffectSize
)
export const linearHoldEffectBottom = laneBottom
export const linearHoldEffectTop = Add(
    laneBottom,
    Multiply(2, halfLinearHoldEffectWidth)
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
export const circularHoldEffectBottom = Subtract(
    laneBottom,
    halfCircularHoldEffectHeight
)
export const circularHoldEffectTop = Add(
    laneBottom,
    halfCircularHoldEffectHeight
)
