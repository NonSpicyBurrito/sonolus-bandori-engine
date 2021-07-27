import { And, EffectClip, InputJudgment, Play } from 'sonolus.js'
import { options } from '../../../configuration/options'
import { minSFXDistance } from './constants'

export function playStageSFX() {
    return And(options.isSFXEnabled, Play(EffectClip.Stage, minSFXDistance))
}

export function playJudgmentSFX() {
    return And(options.isSFXEnabled, Play(InputJudgment, minSFXDistance))
}

export function playFlickSFX() {
    return And(
        options.isSFXEnabled,
        Play(EffectClip.Alternative, minSFXDistance)
    )
}
