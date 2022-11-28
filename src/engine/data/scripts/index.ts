import { ParticleEffect, SkinSprite } from 'sonolus-core'
import { defineScripts } from 'sonolus.js'
import { buckets } from '../buckets'
import { autoNote } from './autoNote'
import { autoSFX } from './autoSFX'
import { directionalFlickNote } from './directionalFlickNote'
import { flickNote } from './flickNote'
import { initialization } from './initialization'
import { simLine } from './simLine'
import { slideEndNote } from './slideEndNote'
import { slideFlickNote } from './slideFlickNote'
import { slider } from './slider'
import { slideTickNote } from './slideTickNote'
import { stage } from './stage'
import { tapNote } from './tapNote'

export const scripts = defineScripts({
    initialization,

    stage,

    tapNote: () => tapNote(buckets.tapNoteIndex, SkinSprite.NoteHeadCyan),
    flickNote,
    directionalFlickNote,
    slideStartNote: () =>
        tapNote(buckets.slideStartNoteIndex, SkinSprite.NoteHeadGreen),
    slideTickNote,
    slideEndNote,
    slideFlickNote,
    straightSlider: () => slider(SkinSprite.NoteConnectionGreen),
    curvedSlider: () => slider(SkinSprite.NoteConnectionGreenSeamless),

    simLine,

    autoSFX,
    autoTapNote: () =>
        autoNote(
            ParticleEffect.NoteLinearTapCyan,
            ParticleEffect.NoteCircularTapCyan,
            'up',
            false
        ),
    autoFlickNote: () =>
        autoNote(
            ParticleEffect.NoteLinearAlternativeRed,
            ParticleEffect.NoteCircularAlternativeRed,
            'up',
            false
        ),
    autoLeftDirectionalFlickNote: () =>
        autoNote(
            ParticleEffect.NoteLinearAlternativePurple,
            ParticleEffect.NoteCircularAlternativePurple,
            'left',
            false
        ),
    autoRightDirectionalFlickNote: () =>
        autoNote(
            ParticleEffect.NoteLinearAlternativeYellow,
            ParticleEffect.NoteCircularAlternativeYellow,
            'right',
            false
        ),
    autoSlideStartNote: () =>
        autoNote(
            ParticleEffect.NoteLinearTapCyan,
            ParticleEffect.NoteCircularTapCyan,
            'up',
            true
        ),
    autoSlideTickNote: () =>
        autoNote(
            ParticleEffect.NoteLinearTapCyan,
            ParticleEffect.NoteCircularTapCyan,
            'up',
            true
        ),
    autoSlideEndNote: () =>
        autoNote(
            ParticleEffect.NoteLinearTapCyan,
            ParticleEffect.NoteCircularTapCyan,
            'up',
            true
        ),
    autoSlideFlickNote: () =>
        autoNote(
            ParticleEffect.NoteLinearAlternativeRed,
            ParticleEffect.NoteCircularAlternativeRed,
            'up',
            true
        ),
})
