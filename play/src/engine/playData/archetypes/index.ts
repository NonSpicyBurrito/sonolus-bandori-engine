import { HoldManager } from './HoldManager.js'
import { Initialization } from './Initialization.js'
import { InputManager } from './InputManager.js'
import { SimLine } from './SimLine.js'
import { Stage } from './Stage.js'
import { IgnoredNote } from './notes/IgnoredNote.js'
import { DirectionalFlickNote } from './notes/visibleNotes/DirectionalFlickNote.js'
import { FlickNote } from './notes/visibleNotes/singleNotes/FlickNote.js'
import { TapNote } from './notes/visibleNotes/singleNotes/TapNote.js'
import { SlideEndFlickNote } from './notes/visibleNotes/singleNotes/slideNotes/SlideEndFlickNote.js'
import { SlideEndNote } from './notes/visibleNotes/singleNotes/slideNotes/SlideEndNote.js'
import { SlideStartNote } from './notes/visibleNotes/singleNotes/slideNotes/SlideStartNote.js'
import { SlideTickNote } from './notes/visibleNotes/singleNotes/slideNotes/SlideTickNote.js'
import { CurvedSlideConnector } from './sliderConnectors/CurvedSlideConnector.js'
import { StraightSlideConnector } from './sliderConnectors/StraightSlideConnector.js'

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
