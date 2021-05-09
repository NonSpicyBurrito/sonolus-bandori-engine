import {
    And,
    bool,
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
    Or,
    SkinSprite,
    SScript,
    Subtract,
    Time,
    TouchEnded,
    TouchId,
    TouchT,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import { buckets } from '../buckets'
import {
    goodWindow,
    greatWindow,
    inputOffset,
    perfectWindow,
    slideWindow,
} from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteLane,
    destroyNoteHoldEffect,
    drawNoteTail,
    InputState,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteLaneEffect,
    playNoteTapEffect,
    processTouchDiscontinue,
    processTouchHead,
    setupAutoInput,
    setupAutoSlider,
    setupAutoTapEffect,
    setupPreprocess,
    setupSimLine,
    updateSlideNoteTailScale,
} from './common/note'
import { playJudgmentSFX } from './common/sfx'
import {
    checkTouchYInHitBox,
    isTouchOccupied,
    updateTouchTilt,
} from './common/touch'

export function slideEndNote(): SScript {
    const bucket = buckets.slideEndNoteIndex

    const preprocess = setupPreprocess()

    const spawnOrder = NoteData.head.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.head.spawnTime)

    const initialize = [
        setupSimLine(),

        setupAutoInput(bucket),
        setupAutoTapEffect(),
        setupAutoSlider(),
    ]

    const touch = Or(options.isAutoplay, [
        processTouchHead(),
        And(
            Equal(noteInputState, InputState.Activated),
            Equal(TouchId, NoteSharedMemory.inputTouchId),
            [
                isTouchOccupied.set(true),
                updateTouchTilt(),
                And(
                    checkNoteTimeInGoodWindow(),
                    TouchEnded,
                    checkTouchYInHitBox(),
                    checkTouchXInNoteLane(),
                    onComplete()
                ),
                processTouchDiscontinue(),
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
            updateSlideNoteTailScale(),
            drawNoteTail(SkinSprite.NoteHeadGreen),
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

    function onComplete() {
        return [
            noteInputState.set(InputState.Terminated),

            NoteSharedMemory.isInputSuccess.set(true),

            InputJudgment.set(
                If(
                    options.isStrictJudgment,
                    Judge(
                        Subtract(TouchT, inputOffset),
                        NoteData.time,
                        perfectWindow,
                        greatWindow,
                        goodWindow
                    ),
                    Judge(
                        Subtract(TouchT, inputOffset),
                        NoteData.time,
                        -perfectWindow,
                        slideWindow,
                        -greatWindow,
                        slideWindow,
                        -goodWindow,
                        slideWindow
                    )
                )
            ),
            InputBucket.set(bucket + 1),
            InputBucketValue.set(
                Multiply(1000, Subtract(TouchT, inputOffset, NoteData.time))
            ),

            playNoteLaneEffect(),
            playNoteTapEffect(),
            playJudgmentSFX(),
        ]
    }
}
