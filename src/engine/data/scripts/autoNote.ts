import { ParticleEffect } from 'sonolus-core'
import { And, EntityMemory, GreaterOr, Not, Script, Time } from 'sonolus.js'
import { playLaneEffect, playNoteEffect } from './common/effect'
import { NoteData, spawnNoteHoldEffect } from './common/note'

export function autoNote(
    linear: ParticleEffect,
    circular: ParticleEffect,
    direction: 'left' | 'up' | 'right',
    isSlide: boolean
): Script {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)

    const hasSlideSpawned = EntityMemory.to<boolean>(1)

    const updateSequential = isSlide
        ? And(GreaterOr(Time, noteData.head.time), Not(hasSlideSpawned), [
              spawnNoteHoldEffect(noteIndex),

              hasSlideSpawned.set(true),
          ])
        : undefined

    const updateParallel = And(GreaterOr(Time, noteData.time), [
        playLaneEffect(noteData.lane),
        playNoteEffect(noteData.center, linear, circular, direction),

        true,
    ])

    return {
        updateSequential,
        updateParallel,
    }
}
