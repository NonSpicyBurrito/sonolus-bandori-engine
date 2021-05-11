import {
    Add,
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
    Less,
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
    While,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import {
    goodWindow,
    greatWindow,
    inputOffset,
    perfectWindow,
    stageWidth,
} from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteLanes,
    drawNoteTail,
    drawNoteTailDirectionalArrow,
    InputState,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteLaneEffect,
    playNoteLeftDirectionalFlickEffect,
    playNoteRightDirectionalFlickEffect,
    processTouchDiscontinue,
    setupArrowOffset,
    setupAutoInput,
    setupAutoLeftDirectionalFlickEffect,
    setupAutoRightDirectionalFlickEffect,
    setupPreprocess,
    setupSimLine,
    updateNoteTailScale,
} from './common/note'
import { playFlickSFX } from './common/sfx'
import { checkTouchYInHitBox, isTouchOccupied } from './common/touch'
import { getDistanceSquared } from './common/utils'

export function directionalFlickNote(
    bucket: number,
    noteSprite: SkinSprite,
    arrowSprite: SkinSprite,
    isLeft: boolean
): SScript {
    const flickActivationTime = EntityMemory.to<number>(0)
    const looper = EntityMemory.to<number>(1)

    const preprocess = [setupPreprocess(), setupArrowOffset(isLeft)]

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = [
        setupSimLine(),

        setupAutoInput(bucket),
        isLeft
            ? setupAutoLeftDirectionalFlickEffect()
            : setupAutoRightDirectionalFlickEffect(),
    ]

    const touch = Or(options.isAutoplay, [
        And(
            Not(bool(noteInputState)),
            checkNoteTimeInGoodWindow(),
            TouchStarted,
            Not(isTouchOccupied),
            checkTouchYInHitBox(),
            checkTouchXInNoteLanes(isLeft),
            onActivate()
        ),
        And(
            Equal(noteInputState, InputState.Activated),
            Equal(TouchId, NoteSharedMemory.inputTouchId),
            [
                isTouchOccupied.set(true),
                And(
                    checkNoteTimeInGoodWindow(),
                    isLeft ? Less(TouchX, TouchSX) : Greater(TouchX, TouchSX),
                    GreaterOr(
                        getDistanceSquared(TouchSX, TouchSY, TouchX, TouchY),
                        Multiply(
                            Subtract(Multiply(0.08, NoteData.width), 0.04),
                            Subtract(Multiply(0.08, NoteData.width), 0.04),
                            stageWidth,
                            stageWidth
                        )
                    ),
                    onComplete()
                ),
                processTouchDiscontinue(),
            ]
        ),
    ])

    const updateParallel = Or(
        And(options.isAutoplay, GreaterOr(Time, NoteData.time)),
        Equal(noteInputState, InputState.Terminated),
        Greater(Subtract(Time, NoteData.time, inputOffset), goodWindow),
        [
            updateNoteTailScale(),

            looper.set(0),
            While(Less(looper, NoteData.width), [
                drawNoteTail(
                    noteSprite,
                    isLeft ? Multiply(looper, -1) : looper,
                    isLeft
                ),
                looper.set(Add(looper, 1)),
            ]),

            drawNoteTailDirectionalArrow(arrowSprite, isLeft),
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
            isLeft
                ? playNoteLeftDirectionalFlickEffect()
                : playNoteRightDirectionalFlickEffect(),
            playFlickSFX(),
        ]
    }
}
