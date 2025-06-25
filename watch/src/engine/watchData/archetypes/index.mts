import { EmptyEffect } from './EmptyEffect.mjs'
import { Initialization } from './Initialization.mjs'
import { SimLine } from './SimLine.mjs'
import { Stage } from './Stage.mjs'
import { IgnoredNote } from './notes/IgnoredNote.mjs'
import { DirectionalFlickNote } from './notes/visibleNotes/DirectionalFlickNote.mjs'
import { SlideEndNote } from './notes/visibleNotes/singleNotes/SlideEndNote.mjs'
import { SlideStartNote } from './notes/visibleNotes/singleNotes/SlideStartNote.mjs'
import { SlideTickNote } from './notes/visibleNotes/singleNotes/SlideTickNote.mjs'
import { TapNote } from './notes/visibleNotes/singleNotes/TapNote.mjs'
import { FlickNote } from './notes/visibleNotes/singleNotes/flickNotes/FlickNote.mjs'
import { SlideEndFlickNote } from './notes/visibleNotes/singleNotes/flickNotes/SlideEndFlickNote.mjs'
import { CurvedSlideConnector } from './sliderConnectors/CurvedSlideConnector.mjs'
import { StraightSlideConnector } from './sliderConnectors/StraightSlideConnector.mjs'

export const archetypes = defineArchetypes({
    Initialization,

    Stage,
    EmptyEffect,

    IgnoredNote,

    TapNote,
    FlickNote,
    DirectionalFlickNote,

    SlideStartNote,
    SlideTickNote,
    SlideEndNote,
    SlideEndFlickNote,

    StraightSlideConnector,
    CurvedSlideConnector,

    SimLine,
})
