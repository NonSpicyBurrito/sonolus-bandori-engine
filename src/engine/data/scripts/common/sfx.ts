import {
    Add,
    And,
    Code,
    EffectClip,
    If,
    InputJudgment,
    Play,
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
import { NoteData } from './note'

export function playStageSFX() {
    return And(options.isSFXEnabled, Play(EffectClip.Stage, minSFXDistance))
}

export function playJudgmentSFX() {
    return And(
        options.isSFXEnabled,
        Play(Add(EffectClip.Miss, InputJudgment), minSFXDistance)
    )
}

export function playFlickSFX() {
    return And(
        options.isSFXEnabled,
        Play(Add(EffectClip.MissAlternative, InputJudgment), minSFXDistance)
    )
}

export function playDirectionalFlickSFX() {
    return And(
        options.isSFXEnabled,
        Play(
            getDirectionalFlickSFX(NoteData.extraWidth, InputJudgment),
            minSFXDistance
        )
    )
}

export function getDirectionalFlickSFX(
    extraWidth: Code<number>,
    judgment: Code<number> = 0
) {
    return If(
        hasDirectionalFlickClips,
        Switch(extraWidth, [
            [0, singleDirectionalFlickClip],
            [1, doubleDirectionalFlickClip],
            [2, tripleDirectionalFlickClip],
        ]),
        Add(EffectClip.MissAlternative, judgment)
    )
}
