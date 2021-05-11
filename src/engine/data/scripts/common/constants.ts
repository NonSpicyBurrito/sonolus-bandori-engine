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
