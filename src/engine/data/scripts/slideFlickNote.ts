import { SkinSprite } from 'sonolus-core'
import {
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
    Max,
    Multiply,
    Not,
    NotEqual,
    Or,
    Script,
    Subtract,
    Time,
    TouchId,
    TouchT,
    TouchX,
    TouchY,
} from 'sonolus.js'
import { scripts } from '.'
import { options } from '../../configuration/options'
import { buckets } from '../buckets'
import {
    goodWindow,
    greatWindow,
    perfectWindow,
    slideWindow,
} from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteHitbox,
    destroyNoteHoldEffect,
    drawNote,
    drawNoteFlickArrow,
    initializeNote,
    InputState,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteFlickEffect,
    playNoteLaneEffect,
    prepareDrawNote,
    preprocessNote,
    stopNoteHoldSFX,
    touchProcessDiscontinue,
    touchProcessHead,
    updateNoteSlideScale,
} from './common/note'
import { playFlickSFX } from './common/sfx'
import {
    checkTouchYInHitbox,
    getMinFlickDistanceSquared,
    isTouchOccupied,
} from './common/touch'
import { getDistanceSquared } from './common/utils'

export function slideFlickNote(): Script {
    const bucket = buckets.slideFlickNoteIndex

    const flickActivationX = EntityMemory.to<number>(0)
    const flickActivationY = EntityMemory.to<number>(1)

    const preprocess = preprocessNote(
        true,
        If(options.isStrictJudgment, goodWindow, slideWindow)
    )

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = initializeNote(
        bucket,
        scripts.autoSlideFlickNoteIndex,
        true,
        true
    )

    const touch = Or(options.isAutoplay, [
        touchProcessHead(),
        And(
            bool(noteInputState),
            NotEqual(noteInputState, InputState.Terminated),
            Equal(TouchId, NoteSharedMemory.inputTouchId),
            [
                isTouchOccupied.set(true),
                And(
                    Equal(noteInputState, InputState.Activated),
                    If(
                        NoteData.isLong,
                        checkNoteTimeInGoodWindow(),
                        GreaterOr(Subtract(Time, InputOffset), NoteData.time)
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
        And(
            Not(options.isAutoplay),
            Not(bool(noteInputState)),
            Greater(
                Subtract(Time, NoteData.head.time, InputOffset),
                If(options.isStrictJudgment, goodWindow, slideWindow)
            )
        ),
        Equal(noteInputState, InputState.Terminated),
        Greater(
            Subtract(Time, NoteData.time, InputOffset),
            If(options.isStrictJudgment, goodWindow, slideWindow)
        ),
        And(GreaterOr(Time, NoteData.visibleTime), [
            updateNoteSlideScale(),
            prepareDrawNote(),
            drawNote(SkinSprite.NoteHeadRed),
            drawNoteFlickArrow(),
        ])
    )

    const terminate = [
        And(
            Or(options.isAutoplay, bool(noteInputState)),
            destroyNoteHoldEffect()
        ),
        Or(options.isAutoplay, stopNoteHoldSFX()),
    ]

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
                        Max(Subtract(TouchT, InputOffset), NoteData.time),
                        NoteData.time,
                        perfectWindow,
                        greatWindow,
                        goodWindow
                    ),
                    Judge(
                        Max(Subtract(TouchT, InputOffset), NoteData.time),
                        NoteData.time,
                        slideWindow,
                        slideWindow,
                        slideWindow
                    )
                )
            ),
            InputAccuracy.set(
                Max(Subtract(TouchT, InputOffset, NoteData.time), 0)
            ),
            InputBucket.set(bucket),
            InputBucketValue.set(Multiply(1000, InputAccuracy)),

            playNoteLaneEffect(),
            playNoteFlickEffect(),
            playFlickSFX(),
        ]
    }
}
