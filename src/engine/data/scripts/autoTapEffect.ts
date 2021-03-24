import { And, EntityMemory, GreaterOr, SScript, Time } from 'sonolus.js'

import { playLaneEffect, playTapOrFlickEffect } from './common/effect'
import { NoteData } from './common/note'

export function autoTapOrFlickEffect(isFlick: boolean): SScript {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)

    const updateParallel = And(GreaterOr(Time, noteData.time), [
        playLaneEffect(noteData.lane),
        playTapOrFlickEffect(noteData.bottomCenter, isFlick),
    ])

    return {
        updateParallel: {
            code: updateParallel,
        },
    }
}
