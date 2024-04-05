import { EngineArchetypeName } from '@sonolus/core'
import { BpmChange } from './BpmChange.mjs'
import { Initialization } from './Initialization.mjs'
import { SimLine } from './SimLine.mjs'
import { Stage } from './Stage.mjs'
import { DirectionalFlickNote } from './notes/DirectionalFlickNote.mjs'
import { IgnoredNote } from './notes/IgnoredNote.mjs'
import { SlideEndNote } from './notes/singleNotes/SlideEndNote.mjs'
import { SlideStartNote } from './notes/singleNotes/SlideStartNote.mjs'
import { SlideTickNote } from './notes/singleNotes/SlideTickNote.mjs'
import { TapNote } from './notes/singleNotes/TapNote.mjs'
import { FlickNote } from './notes/singleNotes/flickNotes/FlickNote.mjs'
import { SlideEndFlickNote } from './notes/singleNotes/flickNotes/SlideEndFlickNote.mjs'
import { CurvedSlideConnector } from './sliderConnectors/CurvedSlideConnector.mjs'
import { StraightSlideConnector } from './sliderConnectors/StraightSlideConnector.mjs'

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
