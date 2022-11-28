import { SkinSprite } from 'sonolus-core'
import {
    Add,
    And,
    bool,
    EntityMemory,
    Equal,
    Greater,
    GreaterOr,
    If,
    InputAccuracy,
    InputBucket,
    InputBucketValue,
    InputJudgment,
    InputOffset,
    Judge,
    Less,
    LessOr,
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
    While,
} from 'sonolus.js'
import { scripts } from '.'
import { options } from '../../configuration/options'
import { buckets } from '../buckets'
import { goodWindow, greatWindow, perfectWindow } from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteHitbox,
    drawNote,
    drawNoteDirectionalFlickArrow,
    initializeNoteAutoEffect,
    initializeNoteAutoInput,
    initializeNoteSimLine,
    InputState,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteLaneEffect,
    playNoteLeftDirectionalFlickEffect,
    playNoteRightDirectionalFlickEffect,
    prepareDrawNote,
    preprocessArrowOffset,
    preprocessNote,
    touchProcessDiscontinue,
    updateNoteScale,
} from './common/note'
import { playDirectionalFlickSFX } from './common/sfx'
import {
    checkTouchYInHitbox,
    getMinFlickDistanceSquared,
    isTouchOccupied,
} from './common/touch'
import { getDistanceSquared } from './common/utils'

export function directionalFlickNote(): Script {
    const flickActivationTime = EntityMemory.to<number>(0)
    const looper = EntityMemory.to<number>(1)

    const bucket = If(
        NoteData.isLeft,
        buckets.leftDirectionalFlickNoteIndex,
        buckets.rightDirectionalFlickNoteIndex
    )

    const preprocess = [
        preprocessNote(false, goodWindow),
        preprocessArrowOffset(),
    ]

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = [
        initializeNoteSimLine(),

        initializeNoteAutoInput(bucket),
        initializeNoteAutoEffect(
            If(
                NoteData.isLeft,
                scripts.autoLeftDirectionalFlickEffectIndex,
                scripts.autoRightDirectionalFlickEffectIndex
            )
        ),
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
                    If(
                        NoteData.isLeft,
                        Less(TouchX, TouchSX),
                        Greater(TouchX, TouchSX)
                    ),
                    GreaterOr(
                        getDistanceSquared(TouchSX, TouchSY, TouchX, TouchY),
                        getMinFlickDistanceSquared(
                            Add(Multiply(0.01, NoteData.extraWidth), 0.01)
                        )
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
        [
            updateNoteScale(),
            prepareDrawNote(),

            looper.set(0),
            While(LessOr(looper, NoteData.extraWidth), [
                If(
                    NoteData.isLeft,
                    drawNote(SkinSprite.NoteHeadPurple, {
                        isLeft: true,
                        offset: looper,
                    }),
                    drawNote(SkinSprite.NoteHeadYellow, {
                        isLeft: false,
                        offset: looper,
                    })
                ),
                looper.set(Add(looper, 1)),
            ]),

            If(
                NoteData.isLeft,
                drawNoteDirectionalFlickArrow(
                    SkinSprite.DirectionalMarkerPurple,
                    true
                ),
                drawNoteDirectionalFlickArrow(
                    SkinSprite.DirectionalMarkerYellow,
                    false
                )
            ),
        ]
    )

    return {
        preprocess,
        spawnOrder,
        shouldSpawn,
        initialize,
        touch,
        updateParallel,
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
            If(
                NoteData.isLeft,
                playNoteLeftDirectionalFlickEffect(),
                playNoteRightDirectionalFlickEffect()
            ),
            playDirectionalFlickSFX(),
        ]
    }
}
