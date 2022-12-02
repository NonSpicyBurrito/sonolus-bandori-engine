import { SkinSprite } from 'sonolus-core'
import { defineScripts } from 'sonolus.js'
import { buckets } from '../buckets'
import { autoNote } from './autoNote'
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

    autoTapNote: () => autoNote(false),
    autoFlickNote: () => autoNote(false),
    autoLeftDirectionalFlickNote: () => autoNote(false),
    autoRightDirectionalFlickNote: () => autoNote(false),
    autoSlideStartNote: () => autoNote(true),
    autoSlideTickNote: () => autoNote(true),
    autoSlideEndNote: () => autoNote(true),
    autoSlideFlickNote: () => autoNote(true),
})
