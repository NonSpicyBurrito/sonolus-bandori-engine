import { EmptyEffect } from './EmptyEffect.js'
import { Initialization } from './Initialization.js'
import { SimLine } from './SimLine.js'
import { Stage } from './Stage.js'
import { IgnoredNote } from './notes/IgnoredNote.js'
import { DirectionalFlickNote } from './notes/visibleNotes/DirectionalFlickNote.js'
import { SlideEndNote } from './notes/visibleNotes/singleNotes/SlideEndNote.js'
import { SlideStartNote } from './notes/visibleNotes/singleNotes/SlideStartNote.js'
import { SlideTickNote } from './notes/visibleNotes/singleNotes/SlideTickNote.js'
import { TapNote } from './notes/visibleNotes/singleNotes/TapNote.js'
import { FlickNote } from './notes/visibleNotes/singleNotes/flickNotes/FlickNote.js'
import { SlideEndFlickNote } from './notes/visibleNotes/singleNotes/flickNotes/SlideEndFlickNote.js'
import { CurvedSlideConnector } from './sliderConnectors/CurvedSlideConnector.js'
import { StraightSlideConnector } from './sliderConnectors/StraightSlideConnector.js'

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
