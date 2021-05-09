import { defineScripts, SkinSprite } from 'sonolus.js'

import { buckets } from '../buckets'
import { autoSFX } from './autoSFX'
import { autoSlider } from './autoSlider'
import { autoTapOrFlickEffect } from './autoTapEffect'
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
    slideStartNote: () =>
        tapNote(buckets.slideStartNoteIndex, SkinSprite.NoteHeadGreen),
    slideTickNote,
    slideEndNote,
    slideFlickNote,
    straightSlider: () => slider(SkinSprite.NoteConnectionGreen),
    curvedSlider: () => slider(11102),

    simLine,

    autoSFX,
    autoTapEffect: () => autoTapOrFlickEffect(false),
    autoFlickEffect: () => autoTapOrFlickEffect(true),
    autoSlider,
})
