import { EffectClip } from 'sonolus-core'
import {
    And,
    AudioOffset,
    Code,
    EntityMemory,
    GreaterOr,
    Not,
    Or,
    PlayLoopedScheduled,
    PlayScheduled,
    Script,
    StopLoopedScheduled,
    Subtract,
    Time,
} from 'sonolus.js'
import { options } from '../../configuration/options'
import { minSFXDistance } from './common/constants'
import {
    NoteData,
    NoteDataPointer,
    NoteSharedMemory,
    spawnNoteHoldEffect,
} from './common/note'

export function autoNote(
    getClip: (noteData: NoteDataPointer) => Code<number>,
    isSlide: boolean
): Script {
    const noteIndex = EntityMemory.to<number>(0)
    const noteData = NoteData.of(noteIndex)
    const noteSharedMemory = NoteSharedMemory.of(noteIndex)

    const sfxTime = EntityMemory.to<number>(1)
    const needSFX = EntityMemory.to<boolean>(2)

    const playHoldTime = EntityMemory.to<number>(3)
    const needPlayHold = EntityMemory.to<boolean>(4)

    const stopHoldTime = EntityMemory.to<number>(5)
    const needStopHold = EntityMemory.to<boolean>(6)

    const needSlide = EntityMemory.to<boolean>(7)

    const initialize = [
        And(options.isSFXEnabled, Or(options.isAutoplay, options.isAutoSFX), [
            sfxTime.set(Subtract(noteData.time, AudioOffset, 0.5)),
            needSFX.set(true),

            And(isSlide, [
                playHoldTime.set(
                    Subtract(noteData.head.time, AudioOffset, 0.5)
                ),
                needPlayHold.set(true),

                stopHoldTime.set(Subtract(noteData.time, AudioOffset, 0.5)),
                needStopHold.set(true),
            ]),
        ]),

        And(options.isAutoplay, isSlide, needSlide.set(true)),
    ]

    const updateSequential = isSlide
        ? [
              And(needSlide, GreaterOr(Time, noteData.head.time), [
                  spawnNoteHoldEffect(noteIndex),

                  needSlide.set(false),
              ]),

              And(needPlayHold, GreaterOr(Time, playHoldTime), [
                  noteSharedMemory.holdSFXClipId.set(
                      PlayLoopedScheduled(EffectClip.Hold, noteData.head.time)
                  ),

                  needPlayHold.set(false),
              ]),
          ]
        : undefined

    const updateParallel = [
        And(needSFX, GreaterOr(Time, sfxTime), [
            PlayScheduled(getClip(noteData), noteData.time, minSFXDistance),

            needSFX.set(false),
        ]),

        And(needStopHold, GreaterOr(Time, stopHoldTime), [
            StopLoopedScheduled(noteSharedMemory.holdSFXClipId, noteData.time),

            needStopHold.set(false),
        ]),

        Not(Or(needSFX, needPlayHold, needStopHold, needSlide)),
    ]

    return {
        initialize,
        updateSequential,
        updateParallel,
    }
}
