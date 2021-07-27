import {
    And,
    EntityMemory,
    GreaterOr,
    ParticleEffect,
    SScript,
    Time,
} from 'sonolus.js'
import { playLaneEffect, playNoteEffect } from './common/effect'
import { NoteData } from './common/note'

export function autoNoteEffect(
    linear: ParticleEffect,
    circular: ParticleEffect,
    direction: 'left' | 'up' | 'right'
): SScript {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)

    const updateParallel = And(GreaterOr(Time, noteData.time), [
        playLaneEffect(noteData.lane),
        playNoteEffect(noteData.center, linear, circular, direction),
    ])

    return {
        updateParallel: {
            code: updateParallel,
        },
    }
}
