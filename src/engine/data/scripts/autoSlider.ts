import { And, EntityMemory, GreaterOr, Script, Time } from 'sonolus.js'
import { spawnHoldEffect } from './common/effect'
import { NoteData, NoteSharedMemory } from './common/note'

export function autoSlider(): Script {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)

    const updateSequential = And(GreaterOr(Time, noteData.head.time), [
        spawnHoldEffect(NoteSharedMemory.of(noteIndex), noteData.head.center),

        true,
    ])

    return {
        updateSequential,
    }
}
