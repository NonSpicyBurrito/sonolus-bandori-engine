import { ParticleEffect } from 'sonolus-core'
import {
    And,
    AudioOffset,
    Code,
    EntityMemory,
    GreaterOr,
    Not,
    Or,
    PlayScheduled,
    Script,
    Subtract,
    Time,
} from 'sonolus.js'
import { options } from '../../configuration/options'
import { minSFXDistance } from './common/constants'
import { playLaneEffect, playNoteEffect } from './common/effect'
import { NoteData, NoteDataPointer, spawnNoteHoldEffect } from './common/note'

export function autoNote(
    getClip: (noteData: NoteDataPointer) => Code<number>,
    linear: ParticleEffect,
    circular: ParticleEffect,
    direction: 'left' | 'up' | 'right',
    isSlide: boolean
): Script {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)

    const sfxTime = EntityMemory.to<number>(1)
    const needSFX = EntityMemory.to<boolean>(2)

    const needSlide = EntityMemory.to<boolean>(3)

    const needEffect = EntityMemory.to<boolean>(4)

    const initialize = [
        And(options.isSFXEnabled, Or(options.isAutoplay, options.isAutoSFX), [
            sfxTime.set(Subtract(noteData.time, AudioOffset, 0.5)),
            needSFX.set(true),
        ]),

        And(isSlide, options.isAutoplay, needSlide.set(true)),

        And(
            options.isLaneEffectEnabled,
            options.isNoteEffectEnabled,
            options.isAutoplay,
            needEffect.set(true)
        ),
    ]

    const updateSequential = isSlide
        ? And(needSlide, GreaterOr(Time, noteData.head.time), [
              spawnNoteHoldEffect(noteIndex),

              needSlide.set(false),
          ])
        : undefined

    const updateParallel = [
        And(needSFX, GreaterOr(Time, sfxTime), [
            PlayScheduled(getClip(noteData), noteData.time, minSFXDistance),

            needSFX.set(false),
        ]),

        And(needEffect, GreaterOr(Time, noteData.time), [
            playLaneEffect(noteData.lane),
            playNoteEffect(noteData.center, linear, circular, direction),

            needEffect.set(false),
        ]),

        Not(Or(needSFX, needSlide, needEffect)),
    ]

    return {
        initialize,
        updateSequential,
        updateParallel,
    }
}
