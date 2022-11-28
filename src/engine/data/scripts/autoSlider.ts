import { And, EntityMemory, GreaterOr, Script, Time } from 'sonolus.js'
import { NoteData, spawnNoteHoldEffect } from './common/note'

export function autoSlider(): Script {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)

    const updateSequential = And(GreaterOr(Time, noteData.head.time), [
        spawnNoteHoldEffect(noteIndex),

        true,
    ])

    return {
        updateSequential,
    }
}
