import { HoldManager } from './HoldManager.mjs'
import { Initialization } from './Initialization.mjs'
import { InputManager } from './InputManager.mjs'
import { SimLine } from './SimLine.mjs'
import { Stage } from './Stage.mjs'
import { IgnoredNote } from './notes/IgnoredNote.mjs'
import { DirectionalFlickNote } from './notes/visibleNotes/DirectionalFlickNote.mjs'
import { FlickNote } from './notes/visibleNotes/singleNotes/FlickNote.mjs'
import { TapNote } from './notes/visibleNotes/singleNotes/TapNote.mjs'
import { SlideEndFlickNote } from './notes/visibleNotes/singleNotes/slideNotes/SlideEndFlickNote.mjs'
import { SlideEndNote } from './notes/visibleNotes/singleNotes/slideNotes/SlideEndNote.mjs'
import { SlideStartNote } from './notes/visibleNotes/singleNotes/slideNotes/SlideStartNote.mjs'
import { SlideTickNote } from './notes/visibleNotes/singleNotes/slideNotes/SlideTickNote.mjs'
import { CurvedSlideConnector } from './sliderConnectors/CurvedSlideConnector.mjs'
import { StraightSlideConnector } from './sliderConnectors/StraightSlideConnector.mjs'

export const archetypes = defineArchetypes({
    Initialization,
    InputManager,
    HoldManager,

    Stage,

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
