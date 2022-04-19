import { EffectClip } from 'sonolus-core'
import {
    Add,
    And,
    AudioOffset,
    bool,
    EntityInfo,
    EntityMemory,
    Equal,
    GreaterOr,
    Not,
    Or,
    PlayScheduled,
    Script,
    Subtract,
    Switch,
    Time,
} from 'sonolus.js'
import { archetypes } from '../archetypes'
import { minSFXDistance } from './common/constants'
import { NoteData } from './common/note'
import { getDirectionalFlickSFX } from './common/sfx'

export function autoSFX(): Script {
    const noteIndex = EntityMemory.to<number>(0)
    const noteInfo = EntityInfo.of(noteIndex)
    const noteData = NoteData.of(noteIndex)

    const initialize = noteIndex.set(2)

    const updateParallel = Or(
        Equal(noteInfo.archetype, archetypes.straightSliderIndex),
        Equal(noteInfo.archetype, archetypes.curvedSliderIndex),
        Not(bool(noteInfo.archetype)),
        And(GreaterOr(Time, Subtract(noteData.time, AudioOffset, 1)), [
            PlayScheduled(
                Switch(
                    noteInfo.archetype,
                    [
                        [
                            archetypes.flickNoteIndex,
                            EffectClip.PerfectAlternative,
                        ],
                        [
                            archetypes.slideFlickNoteIndex,
                            EffectClip.PerfectAlternative,
                        ],
                        [
                            archetypes.directionalFlickNoteIndex,
                            getDirectionalFlickSFX(noteData.extraWidth),
                        ],
                    ],
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
