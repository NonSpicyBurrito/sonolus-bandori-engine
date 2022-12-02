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
    TouchEnded,
    TouchId,
    TouchT,
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
    initializeNote,
    InputState,
    isNotHidden,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteLaneEffect,
    playNoteTapEffect,
    prepareDrawNote,
    preprocessNote,
    stopNoteHoldSFX,
    touchProcessDiscontinue,
    touchProcessHead,
    updateNoteSlideScale,
} from './common/note'
import { playJudgmentSFX } from './common/sfx'
import { checkTouchYInHitbox, isTouchOccupied } from './common/touch'

export function slideEndNote(): Script {
    const bucket = buckets.slideEndNoteIndex

    const preprocess = preprocessNote(
        true,
        If(options.isStrictJudgment, goodWindow, slideWindow)
    )

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = initializeNote(
        bucket,
        scripts.autoSlideEndNoteIndex,
        true,
        true
    )

    const touch = Or(options.isAutoplay, [
        touchProcessHead(),
        And(
            Equal(noteInputState, InputState.Activated),
            Equal(TouchId, NoteSharedMemory.inputTouchId),
            [
                isTouchOccupied.set(true),
                And(
                    checkNoteTimeInGoodWindow(),
                    TouchEnded,
                    checkTouchYInHitbox(),
                    checkTouchXInNoteHitbox(),
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
        And(GreaterOr(Time, NoteData.visibleTime), isNotHidden(), [
            updateNoteSlideScale(),
            prepareDrawNote(),
            drawNote(SkinSprite.NoteHeadGreen),
        ])
    )

    const terminate = [
        And(options.isAutoplay, [playNoteLaneEffect(), playNoteTapEffect()]),

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

    function onComplete() {
        return [
            noteInputState.set(InputState.Terminated),

            NoteSharedMemory.isInputSuccess.set(true),

            InputJudgment.set(
                If(
                    options.isStrictJudgment,
                    Judge(
                        Subtract(TouchT, InputOffset),
                        NoteData.time,
                        perfectWindow,
                        greatWindow,
                        goodWindow
                    ),
                    Judge(
                        Subtract(TouchT, InputOffset),
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
            InputAccuracy.set(Subtract(TouchT, InputOffset, NoteData.time)),
            InputBucket.set(bucket),
            InputBucketValue.set(Multiply(1000, InputAccuracy)),

            playNoteLaneEffect(),
            playNoteTapEffect(),
            playJudgmentSFX(),
        ]
    }
}
