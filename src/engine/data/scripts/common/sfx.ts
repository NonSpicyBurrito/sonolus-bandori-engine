import { EffectClip } from 'sonolus-core'
import {
    Add,
    And,
    Code,
    If,
    InputJudgment,
    Not,
    Play,
    PlayLooped,
    StopLooped,
    Switch,
} from 'sonolus.js'
import { options } from '../../../configuration/options'
import {
    doubleDirectionalFlickClip,
    hasDirectionalFlickClips,
    minSFXDistance,
    singleDirectionalFlickClip,
    tripleDirectionalFlickClip,
} from './constants'
import { NoteData, NoteSharedMemoryPointer } from './note'

export const getDirectionalFlickSFX = (extraWidth: Code<number>, judgment: Code<number> = 0) =>
    If(
        hasDirectionalFlickClips,
        Switch(extraWidth, [
            [0, singleDirectionalFlickClip],
            [1, doubleDirectionalFlickClip],
            [2, tripleDirectionalFlickClip],
        ]),
        Add(EffectClip.MissAlternative, judgment)
    )

export const playStageSFX = () => And(options.isSFXEnabled, Play(EffectClip.Stage, minSFXDistance))

export const playJudgmentSFX = () => playSFX(Add(EffectClip.Miss, InputJudgment))

export const playFlickSFX = () => playSFX(Add(EffectClip.MissAlternative, InputJudgment))

export const playDirectionalFlickSFX = () =>
    playSFX(getDirectionalFlickSFX(NoteData.extraWidth, InputJudgment))

export const playHoldSFX = (noteSharedMemory: NoteSharedMemoryPointer) =>
    And(
        options.isSFXEnabled,
        Not(options.isAutoSFX),
        noteSharedMemory.holdSFXClipId.set(PlayLooped(EffectClip.Hold))
    )

export const stopHoldSFX = (noteSharedMemory: NoteSharedMemoryPointer) =>
    And(options.isSFXEnabled, Not(options.isAutoSFX), StopLooped(noteSharedMemory.holdSFXClipId))

const playSFX = (id: Code<number>) =>
    And(options.isSFXEnabled, Not(options.isAutoSFX), Play(id, minSFXDistance))
