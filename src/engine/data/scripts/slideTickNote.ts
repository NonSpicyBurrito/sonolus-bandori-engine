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
    InputOffset,
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
import { scripts } from '.'
import {
    goodWindow,
    greatWindow,
    perfectWindow,
    slideWindow,
} from './common/constants'
import {
    checkTouchXInNoteHitbox,
    destroyNoteHoldEffect,
    drawNote,
    initializeAutoSlider,
    initializeNoteAutoEffect,
    initializeNoteAutoInput,
    InputState,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteLaneEffect,
    playNoteTapEffect,
    prepareDrawNote,
    preprocessNote,
    preprocessSlideSpawnTime,
    touchProcessDiscontinue,
    touchProcessHead,
    updateNoteSlideScale,
} from './common/note'
import { playJudgmentSFX } from './common/sfx'
import {
    checkTouchYInHitbox,
    isTouchOccupied,
    updateTouchTilt,
} from './common/touch'

export function slideTickNote(): SScript {
    const bucket = buckets.slideTickNoteIndex

    const preprocess = [preprocessNote(), preprocessSlideSpawnTime()]

    const spawnOrder = NoteData.slideSpawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.slideSpawnTime)

    const initialize = [
        initializeNoteAutoInput(bucket),
        initializeNoteAutoEffect(scripts.autoTapEffectIndex),
        initializeAutoSlider(),
    ]

    const touch = Or(options.isAutoplay, [
        touchProcessHead(),
        And(
            Equal(noteInputState, InputState.Activated),
            Equal(TouchId, NoteSharedMemory.inputTouchId),
            [
                isTouchOccupied.set(true),
                updateTouchTilt(),
                And(
                    GreaterOr(Subtract(Time, InputOffset), NoteData.time),
                    checkTouchYInHitbox(),
                    checkTouchXInNoteHitbox(),
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
                Subtract(Time, NoteData.head.time, InputOffset),
                If(options.isStrictJudgment, goodWindow, slideWindow)
            )
        ),
        And(
            Equal(noteInputState, InputState.Terminated),
            destroyNoteHoldEffect()
        ),
        And(
            Greater(
                Subtract(Time, NoteData.time, InputOffset),
                If(options.isStrictJudgment, goodWindow, slideWindow)
            ),
            destroyNoteHoldEffect()
        ),
        And(GreaterOr(Time, NoteData.spawnTime), [
            updateNoteSlideScale(),
            prepareDrawNote(),
            drawNote(SkinSprite.NoteTickGreen),
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
                        Subtract(Time, InputOffset),
                        NoteData.time,
                        perfectWindow,
                        greatWindow,
                        goodWindow
                    ),
                    Judge(
                        Subtract(Time, InputOffset),
                        NoteData.time,
                        slideWindow,
                        slideWindow,
                        slideWindow
                    )
                )
            ),
            InputBucket.set(bucket),
            InputBucketValue.set(
                Multiply(1000, Subtract(Time, InputOffset, NoteData.time))
            ),

            playNoteLaneEffect(),
            playNoteTapEffect(),
            playJudgmentSFX(),
        ]
    }
}
