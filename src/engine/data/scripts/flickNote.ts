import { SkinSprite } from 'sonolus-core'
import {
    And,
    bool,
    EntityMemory,
    Equal,
    Greater,
    GreaterOr,
    InputAccuracy,
    InputBucket,
    InputBucketValue,
    InputJudgment,
    InputOffset,
    Judge,
    Multiply,
    Not,
    Or,
    Script,
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
import { scripts } from '.'
import { options } from '../../configuration/options'
import { buckets } from '../buckets'
import { goodWindow, greatWindow, perfectWindow } from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteHitbox,
    drawNote,
    drawNoteFlickArrow,
    initializeNote,
    InputState,
    isNotHidden,
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
import {
    checkTouchYInHitbox,
    getMinFlickDistanceSquared,
    isTouchOccupied,
} from './common/touch'
import { getDistanceSquared } from './common/utils'

export function flickNote(): Script {
    const bucket = buckets.flickNoteIndex

    const flickActivationTime = EntityMemory.to<number>(0)

    const preprocess = preprocessNote(false, goodWindow)

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = initializeNote(
        bucket,
        scripts.autoFlickNoteIndex,
        false,
        true
    )

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
                        getMinFlickDistanceSquared(0.04)
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
        Greater(Subtract(Time, NoteData.time, InputOffset), goodWindow),
        And(GreaterOr(Time, NoteData.visibleTime), isNotHidden(), [
            updateNoteScale(),
            prepareDrawNote(),
            drawNote(SkinSprite.NoteHeadRed),
            drawNoteFlickArrow(),
        ])
    )

    const terminate = And(options.isAutoplay, [
        playNoteLaneEffect(),
        playNoteFlickEffect(),
    ])

    return {
        preprocess,
        spawnOrder,
        shouldSpawn,
        initialize,
        touch,
        updateParallel,
        terminate,
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
                    Subtract(flickActivationTime, InputOffset),
                    NoteData.time,
                    perfectWindow,
                    greatWindow,
                    goodWindow
                )
            ),
            InputAccuracy.set(
                Subtract(flickActivationTime, InputOffset, NoteData.time)
            ),
            InputBucket.set(bucket),
            InputBucketValue.set(Multiply(1000, InputAccuracy)),

            playNoteLaneEffect(),
            playNoteFlickEffect(),
            playFlickSFX(),
        ]
    }
}
