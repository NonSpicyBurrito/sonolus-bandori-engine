import { EffectClip, SkinSprite } from 'sonolus-core'
import { defineScripts } from 'sonolus.js'
import { buckets } from '../buckets'
import { autoNote } from './autoNote'
import { getDirectionalFlickSFX } from './common/sfx'
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

    autoTapNote: () => autoNote(() => EffectClip.Perfect, false),
    autoFlickNote: () => autoNote(() => EffectClip.PerfectAlternative, false),
    autoLeftDirectionalFlickNote: () =>
        autoNote(
            (noteData) => getDirectionalFlickSFX(noteData.extraWidth),
            false
        ),
    autoRightDirectionalFlickNote: () =>
        autoNote(
            (noteData) => getDirectionalFlickSFX(noteData.extraWidth),
            false
        ),
    autoSlideStartNote: () => autoNote(() => EffectClip.Perfect, true),
    autoSlideTickNote: () => autoNote(() => EffectClip.Perfect, true),
    autoSlideEndNote: () => autoNote(() => EffectClip.Perfect, true),
    autoSlideFlickNote: () =>
        autoNote(() => EffectClip.PerfectAlternative, true),
})
