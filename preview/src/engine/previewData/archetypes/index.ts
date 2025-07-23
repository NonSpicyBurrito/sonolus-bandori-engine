import { EngineArchetypeName } from '@sonolus/core'
import { BpmChange } from './BpmChange.js'
import { Initialization } from './Initialization.js'
import { SimLine } from './SimLine.js'
import { Stage } from './Stage.js'
import { DirectionalFlickNote } from './notes/DirectionalFlickNote.js'
import { IgnoredNote } from './notes/IgnoredNote.js'
import { SlideEndNote } from './notes/singleNotes/SlideEndNote.js'
import { SlideStartNote } from './notes/singleNotes/SlideStartNote.js'
import { SlideTickNote } from './notes/singleNotes/SlideTickNote.js'
import { TapNote } from './notes/singleNotes/TapNote.js'
import { FlickNote } from './notes/singleNotes/flickNotes/FlickNote.js'
import { SlideEndFlickNote } from './notes/singleNotes/flickNotes/SlideEndFlickNote.js'
import { CurvedSlideConnector } from './sliderConnectors/CurvedSlideConnector.js'
import { StraightSlideConnector } from './sliderConnectors/StraightSlideConnector.js'

export const archetypes = defineArchetypes({
    Initialization,

    [EngineArchetypeName.BpmChange]: BpmChange,

    Stage,

    IgnoredNote,
    DirectionalFlickNote,

    TapNote,
    SlideStartNote,
    SlideTickNote,
    SlideEndNote,

    FlickNote,
    SlideEndFlickNote,

    StraightSlideConnector,
    CurvedSlideConnector,

    SimLine,
})
