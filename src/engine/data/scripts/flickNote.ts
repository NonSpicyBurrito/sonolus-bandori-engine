import {
    And,
    bool,
    EntityMemory,
    Equal,
    Greater,
    GreaterOr,
    InputBucket,
    InputBucketValue,
    InputJudgment,
    Judge,
    Multiply,
    Not,
    Or,
    SkinSprite,
    SScript,
    Subtract,
    Time,
    TouchId,
    TouchST,
    TouchStarted,
    TouchSX,
    TouchSY,
    TouchX,
    TouchY,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import { buckets } from '../buckets'
import { scripts } from '.'
import {
    goodWindow,
    greatWindow,
    inputOffset,
    minFlickDistanceSquared,
    perfectWindow,
} from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteHitbox,
    drawNote,
    drawNoteFlickArrow,
    initializeNoteAutoEffect,
    initializeNoteAutoInput,
    initializeNoteSimLine,
    InputState,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteFlickEffect,
    playNoteLaneEffect,
    prepareDrawNote,
    preprocessNote,
    touchProcessDiscontinue,
    updateNoteScale,
} from './common/note'
import { playFlickSFX } from './common/sfx'
import { checkTouchYInHitbox, isTouchOccupied } from './common/touch'
import { getDistanceSquared } from './common/utils'

export function flickNote(): SScript {
    const bucket = buckets.flickNoteIndex

    const flickActivationTime = EntityMemory.to<number>(0)

    const preprocess = preprocessNote()

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = [
        initializeNoteSimLine(),

        initializeNoteAutoInput(bucket),
        initializeNoteAutoEffect(scripts.autoFlickEffectIndex),
    ]

    const touch = Or(options.isAutoplay, [
        And(
            Not(bool(noteInputState)),
            checkNoteTimeInGoodWindow(),
            TouchStarted,
            Not(isTouchOccupied),
            checkTouchYInHitbox(),
            checkTouchXInNoteHitbox(),
            onActivate()
        ),
        And(
            Equal(noteInputState, InputState.Activated),
            Equal(TouchId, NoteSharedMemory.inputTouchId),
            [
                isTouchOccupied.set(true),
                And(
                    checkNoteTimeInGoodWindow(),
                    GreaterOr(
                        getDistanceSquared(TouchSX, TouchSY, TouchX, TouchY),
                        minFlickDistanceSquared
                    ),
                    onComplete()
                ),
                touchProcessDiscontinue(),
            ]
        ),
    ])

    const updateParallel = Or(
        And(options.isAutoplay, GreaterOr(Time, NoteData.time)),
        Equal(noteInputState, InputState.Terminated),
        Greater(Subtract(Time, NoteData.time, inputOffset), goodWindow),
        [
            updateNoteScale(),
            prepareDrawNote(),
            drawNote(SkinSprite.NoteHeadRed),
            drawNoteFlickArrow(),
        ]
    )

    return {
        preprocess: {
            code: preprocess,
        },
        spawnOrder: {
            code: spawnOrder,
        },
        shouldSpawn: {
            code: shouldSpawn,
        },
        initialize: {
            code: initialize,
        },
        touch: {
            code: touch,
        },
        updateParallel: {
            code: updateParallel,
        },
    }

    function onActivate() {
        return [
            isTouchOccupied.set(true),
            noteInputState.set(InputState.Activated),

            NoteSharedMemory.inputTouchId.set(TouchId),

            flickActivationTime.set(TouchST),
        ]
    }

    function onComplete() {
        return [
            noteInputState.set(InputState.Terminated),

            NoteSharedMemory.isInputSuccess.set(true),

            InputJudgment.set(
                Judge(
                    Subtract(flickActivationTime, inputOffset),
                    NoteData.time,
                    perfectWindow,
                    greatWindow,
                    goodWindow
                )
            ),
            InputBucket.set(bucket + 1),
            InputBucketValue.set(
                Multiply(
                    1000,
                    Subtract(flickActivationTime, inputOffset, NoteData.time)
                )
            ),

            playNoteLaneEffect(),
            playNoteFlickEffect(),
            playFlickSFX(),
        ]
    }
}
