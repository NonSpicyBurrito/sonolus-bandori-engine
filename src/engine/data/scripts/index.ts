import { defineScripts, ParticleEffect, SkinSprite } from 'sonolus.js'

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
import { stageTilt } from './stageTilt'
import { tapNote } from './tapNote'

export const scripts = defineScripts({
    initialization,

    stage,
    stageTilt,

    tapNote: () => tapNote(buckets.tapNoteIndex, SkinSprite.NoteHeadCyan),
    flickNote,
    leftDirectionalFlickNote: () =>
        directionalFlickNote(
            SkinSprite.NoteHeadPurple,
            SkinSprite.DirectionalMarkerPurple,
            true
        ),
    rightDirectionalFlickNote: () =>
        directionalFlickNote(
            SkinSprite.NoteHeadYellow,
            SkinSprite.DirectionalMarkerYellow,
            false
        ),
    slideStartNote: () =>
        tapNote(buckets.slideStartNoteIndex, SkinSprite.NoteHeadGreen),
    slideTickNote,
    slideEndNote,
    slideFlickNote,
    straightSlider: () => slider(SkinSprite.NoteConnectionGreen),
    curvedSlider: () => slider(11102),

    simLine,

    autoSFX,
    autoTapEffect: () =>
        autoNoteEffect(
            ParticleEffect.NoteLinearTapCyan,
            ParticleEffect.NoteCircularTapCyan
        ),
    autoFlickEffect: () =>
        autoNoteEffect(
            ParticleEffect.NoteLinearAlternativeRed,
            ParticleEffect.NoteCircularAlternativeRed
        ),
    autoLeftDirectionalFlickEffect: () =>
        autoNoteEffect(
            ParticleEffect.NoteLinearAlternativePurple,
            ParticleEffect.NoteCircularAlternativePurple
        ),
    autoRightDirectionalFlickEffect: () =>
        autoNoteEffect(
            ParticleEffect.NoteLinearAlternativeYellow,
            ParticleEffect.NoteCircularAlternativeYellow
        ),
    autoSlider,
})
