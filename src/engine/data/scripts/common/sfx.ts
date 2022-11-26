import { EffectClip } from 'sonolus-core'
import { Add, And, Code, If, InputJudgment, Play, Switch } from 'sonolus.js'
import { options } from '../../../configuration/options'
import {
    doubleDirectionalFlickClip,
    hasDirectionalFlickClips,
    minSFXDistance,
    singleDirectionalFlickClip,
    tripleDirectionalFlickClip,
} from './constants'
import { NoteData } from './note'

export const getDirectionalFlickSFX = (
    extraWidth: Code<number>,
    judgment: Code<number> = 0
) =>
    If(
        hasDirectionalFlickClips,
        Switch(extraWidth, [
            [0, singleDirectionalFlickClip],
            [1, doubleDirectionalFlickClip],
            [2, tripleDirectionalFlickClip],
        ]),
        Add(EffectClip.MissAlternative, judgment)
    )

export const playStageSFX = () => playSFX(EffectClip.Stage)

export const playJudgmentSFX = () =>
    playSFX(Add(EffectClip.Miss, InputJudgment))

export const playFlickSFX = () =>
    playSFX(Add(EffectClip.MissAlternative, InputJudgment))

export const playDirectionalFlickSFX = () =>
    playSFX(getDirectionalFlickSFX(NoteData.extraWidth, InputJudgment))

const playSFX = (id: Code<number>) =>
    And(options.isSFXEnabled, Play(id, minSFXDistance))
