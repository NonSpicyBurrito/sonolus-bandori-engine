import {
    And,
    EntityMemory,
    GreaterOr,
    Not,
    Or,
    RemapClamped,
    SScript,
    Time,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import { spawnHoldEffect } from './common/effect'
import { NoteData, NoteSharedMemory } from './common/note'
import { updateTilt } from './common/stageTilt'

export function autoSlider(): SScript {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)

    const hasSpawnedHoldEffect = EntityMemory.to<boolean>(1)

    const updateSequential = Or(
        GreaterOr(Time, noteData.time),
        And(GreaterOr(Time, noteData.head.time), [
            Or(hasSpawnedHoldEffect, [
                spawnHoldEffect(
                    NoteSharedMemory.of(noteIndex),
                    noteData.head.bottomCenter
                ),
                hasSpawnedHoldEffect.set(true),
            ]),
            updateTilt(
                RemapClamped(
                    noteData.head.time,
                    noteData.time,
                    noteData.head.bottomCenter,
                    noteData.bottomCenter,
                    Time
                )
            ),
            Not(options.isStageTiltEnabled),
        ])
    )

    return {
        updateSequential: {
            code: updateSequential,
        },
    }
}
