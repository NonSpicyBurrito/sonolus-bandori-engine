import {
    Add,
    And,
    bool,
    EffectClip,
    EntityInfo,
    EntityMemory,
    Equal,
    GreaterOr,
    If,
    Not,
    Or,
    PlayScheduled,
    SScript,
    Subtract,
    Time,
} from 'sonolus.js'

import { archetypes } from '../archetypes'
import { minSFXDistance } from './common/constants'
import { NoteData } from './common/note'

export function autoSFX(): SScript {
    const noteIndex = EntityMemory.to<number>(0)
    const noteInfo = EntityInfo.of(noteIndex)
    const noteData = NoteData.of(noteIndex)

    const initialize = noteIndex.set(2)

    const updateParallel = Or(
        Equal(noteInfo.archetype, archetypes.straightSliderIndex),
        Equal(noteInfo.archetype, archetypes.curvedSliderIndex),
        Not(bool(noteInfo.archetype)),
        And(GreaterOr(Time, Subtract(noteData.time, 1)), [
            PlayScheduled(
                If(
                    Or(
                        ...[
                            archetypes.flickNoteIndex,
                            archetypes.leftDirectionalFlickNoteIndex,
                            archetypes.rightDirectionalFlickNoteIndex,
                            archetypes.slideFlickNoteIndex,
                        ].map((index) => Equal(noteInfo.archetype, index))
                    ),
                    EffectClip.Alternative,
                    EffectClip.Perfect
                ),
                noteData.time,
                minSFXDistance
            ),
            noteIndex.set(Add(noteIndex, 1)),
        ])
    )

    return {
        initialize: {
            code: initialize,
        },
        updateParallel: {
            code: updateParallel,
        },
    }
}
