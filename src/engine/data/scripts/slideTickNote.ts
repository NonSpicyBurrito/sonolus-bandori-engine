import { SkinSprite } from 'sonolus-core'
import {
    And,
    bool,
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
    Multiply,
    Not,
    Or,
    Script,
    Subtract,
    Time,
    TouchId,
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
import { checkTouchYInHitbox, isTouchOccupied } from './common/touch'

export function slideTickNote(): Script {
    const bucket = buckets.slideTickNoteIndex

    const preprocess = [
        preprocessNote(If(options.isStrictJudgment, goodWindow, slideWindow)),
        preprocessSlideSpawnTime(),
    ]

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
        preprocess,
        spawnOrder,
        shouldSpawn,
        initialize,
        touch,
        updateParallel,
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
            InputAccuracy.set(Subtract(Time, InputOffset, NoteData.time)),
            InputBucket.set(bucket),
            InputBucketValue.set(Multiply(1000, InputAccuracy)),

            playNoteLaneEffect(),
            playNoteTapEffect(),
            playJudgmentSFX(),
        ]
    }
}
