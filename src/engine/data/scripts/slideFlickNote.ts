import {
    And,
    bool,
    EntityMemory,
    Equal,
    Greater,
    GreaterOr,
    If,
    InputBucket,
    InputBucketValue,
    InputJudgment,
    Judge,
    Multiply,
    Not,
    NotEqual,
    Or,
    SkinSprite,
    SScript,
    Subtract,
    Time,
    TouchId,
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
    slideWindow,
} from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteHitbox,
    destroyNoteHoldEffect,
    drawNote,
    drawNoteFlickArrow,
    initializeAutoSlider,
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
    preprocessSlideSpawnTime,
    touchProcessDiscontinue,
    touchProcessHead,
    updateNoteSlideScale,
} from './common/note'
import { playFlickSFX } from './common/sfx'
import {
    checkTouchYInHitbox,
    isTouchOccupied,
    updateTouchTilt,
} from './common/touch'
import { getDistanceSquared } from './common/utils'

export function slideFlickNote(): SScript {
    const bucket = buckets.slideFlickNoteIndex

    const flickActivationX = EntityMemory.to<number>(0)
    const flickActivationY = EntityMemory.to<number>(1)

    const preprocess = [preprocessNote(), preprocessSlideSpawnTime()]

    const spawnOrder = NoteData.slideSpawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.slideSpawnTime)

    const initialize = [
        initializeNoteSimLine(),

        initializeNoteAutoInput(bucket),
        initializeNoteAutoEffect(scripts.autoFlickEffectIndex),
        initializeAutoSlider(),
    ]

    const touch = Or(options.isAutoplay, [
        touchProcessHead(),
        And(
            bool(noteInputState),
            NotEqual(noteInputState, InputState.Terminated),
            Equal(TouchId, NoteSharedMemory.inputTouchId),
            [
                isTouchOccupied.set(true),
                updateTouchTilt(),
                And(
                    Equal(noteInputState, InputState.Activated),
                    If(
                        NoteData.isLong,
                        checkNoteTimeInGoodWindow(),
                        GreaterOr(Subtract(Time, inputOffset), NoteData.time)
                    ),
                    checkTouchYInHitbox(),
                    checkTouchXInNoteHitbox(),
                    onActivate()
                ),
                And(
                    Equal(noteInputState, InputState.ActivatedNext),
                    GreaterOr(
                        getDistanceSquared(
                            flickActivationX,
                            flickActivationY,
                            TouchX,
                            TouchY
                        ),
                        minFlickDistanceSquared
                    ),
                    onComplete()
                ),
                touchProcessDiscontinue(),
            ]
        ),
    ])

    const updateParallel = Or(
        And(
            options.isAutoplay,
            GreaterOr(Time, NoteData.time),
            destroyNoteHoldEffect()
        ),
        And(
            Not(options.isAutoplay),
            Not(bool(noteInputState)),
            Greater(
                Subtract(Time, NoteData.head.time, inputOffset),
                If(options.isStrictJudgment, goodWindow, slideWindow)
            )
        ),
        And(
            Equal(noteInputState, InputState.Terminated),
            destroyNoteHoldEffect()
        ),
        And(
            Greater(
                Subtract(Time, NoteData.time, inputOffset),
                If(options.isStrictJudgment, goodWindow, slideWindow)
            ),
            destroyNoteHoldEffect()
        ),
        And(GreaterOr(Time, NoteData.spawnTime), [
            updateNoteSlideScale(),
            prepareDrawNote(),
            drawNote(SkinSprite.NoteHeadRed),
            drawNoteFlickArrow(),
        ])
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
            noteInputState.set(InputState.ActivatedNext),

            flickActivationX.set(TouchX),
            flickActivationY.set(TouchY),
        ]
    }

    function onComplete() {
        return [
            noteInputState.set(InputState.Terminated),

            NoteSharedMemory.isInputSuccess.set(true),

            InputJudgment.set(
                If(
                    options.isStrictJudgment,
                    Judge(
                        Subtract(Time, inputOffset),
                        NoteData.time,
                        perfectWindow,
                        greatWindow,
                        goodWindow
                    ),
                    Judge(
                        Subtract(Time, inputOffset),
                        NoteData.time,
                        slideWindow,
                        slideWindow,
                        slideWindow
                    )
                )
            ),
            InputBucket.set(bucket + 1),
            InputBucketValue.set(
                Multiply(1000, Subtract(Time, inputOffset, NoteData.time))
            ),

            playNoteLaneEffect(),
            playNoteFlickEffect(),
            playFlickSFX(),
        ]
    }
}
