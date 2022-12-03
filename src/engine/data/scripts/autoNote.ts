import { And, EntityMemory, GreaterOr, Not, Script, Time } from 'sonolus.js'
import { options } from '../../configuration/options'
import { NoteData, spawnNoteHoldEffect } from './common/note'

export function autoNote(isSlide: boolean): Script {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)

    const needSlide = EntityMemory.to<boolean>(7)

    const initialize = And(options.isAutoplay, isSlide, needSlide.set(true))

    const updateSequential = isSlide
        ? And(needSlide, GreaterOr(Time, noteData.head.time), [
              spawnNoteHoldEffect(noteIndex),

              needSlide.set(false),
          ])
        : undefined

    const updateParallel = Not(needSlide)

    return {
        initialize,
        updateSequential,
        updateParallel,
    }
}
