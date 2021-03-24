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
    TouchId,
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
    setupSlider,
    updateSlideNoteTailScale,
} from './common/note'
import { playJudgmentSFX } from './common/sfx'
import {
    checkTouchYInHitBox,
    isTouchOccupied,
    updateTouchTilt,
} from './common/touch'

export function slideTickNote(): SScript {
    const bucket = buckets.slideTickNoteIndex

    const preprocess = setupPreprocess()

    const spawnOrder = NoteData.head.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.head.spawnTime)

    const initialize = [
        setupSlider(),

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
                    GreaterOr(Subtract(Time, inputOffset), NoteData.time),
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
            drawNoteTail(SkinSprite.NoteTickGreen),
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
            playNoteTapEffect(),
            playJudgmentSFX(),
        ]
    }
}
