import { ParticleEffect, SkinSprite } from 'sonolus-core'
import { defineScripts } from 'sonolus.js'
import { buckets } from '../buckets'
import { autoNoteEffect } from './autoNoteEffect'
import { autoSFX } from './autoSFX'
import { autoSlider } from './autoSlider'
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
    autoTapEffect: () =>
        autoNoteEffect(
            ParticleEffect.NoteLinearTapCyan,
            ParticleEffect.NoteCircularTapCyan,
            'up'
        ),
    autoFlickEffect: () =>
        autoNoteEffect(
            ParticleEffect.NoteLinearAlternativeRed,
            ParticleEffect.NoteCircularAlternativeRed,
            'up'
        ),
    autoLeftDirectionalFlickEffect: () =>
        autoNoteEffect(
            ParticleEffect.NoteLinearAlternativePurple,
            ParticleEffect.NoteCircularAlternativePurple,
            'left'
        ),
    autoRightDirectionalFlickEffect: () =>
        autoNoteEffect(
            ParticleEffect.NoteLinearAlternativeYellow,
            ParticleEffect.NoteCircularAlternativeYellow,
            'right'
        ),
    autoSlider,
})
