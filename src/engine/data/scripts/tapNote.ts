import {
    And,
    bool,
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
    SkinSprite,
    SScript,
    Subtract,
    Time,
    TouchId,
    TouchST,
    TouchStarted,
} from 'sonolus.js'
import { scripts } from '.'
import { options } from '../../configuration/options'
import { goodWindow, greatWindow, perfectWindow } from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteHitbox,
    drawNote,
    initializeNoteAutoEffect,
    initializeNoteAutoInput,
    initializeNoteSimLine,
    InputState,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteLaneEffect,
    playNoteTapEffect,
    prepareDrawNote,
    preprocessNote,
    updateNoteScale,
} from './common/note'
import { playJudgmentSFX } from './common/sfx'
import { checkTouchYInHitbox, isTouchOccupied } from './common/touch'

export function tapNote(bucket: number, sprite: SkinSprite): SScript {
    const preprocess = preprocessNote(goodWindow)

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = [
        initializeNoteSimLine(),

        initializeNoteAutoInput(bucket),
        initializeNoteAutoEffect(scripts.autoTapEffectIndex),
    ]

    const touch = Or(
        options.isAutoplay,
        And(
            Not(bool(noteInputState)),
            checkNoteTimeInGoodWindow(),
            TouchStarted,
            Not(isTouchOccupied),
            checkTouchYInHitbox(),
            checkTouchXInNoteHitbox(),
            onComplete()
        )
    )

    const updateParallel = Or(
        And(options.isAutoplay, GreaterOr(Time, NoteData.time)),
        Equal(noteInputState, InputState.Terminated),
        Greater(Subtract(Time, NoteData.time, InputOffset), goodWindow),
        [updateNoteScale(), prepareDrawNote(), drawNote(sprite)]
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
            isTouchOccupied.set(true),
            noteInputState.set(InputState.Terminated),

            NoteSharedMemory.isInputSuccess.set(true),
            NoteSharedMemory.inputTouchId.set(TouchId),

            InputJudgment.set(
                Judge(
                    Subtract(TouchST, InputOffset),
                    NoteData.time,
                    perfectWindow,
                    greatWindow,
                    goodWindow
                )
            ),
            InputAccuracy.set(Subtract(TouchST, InputOffset, NoteData.time)),
            InputBucket.set(bucket),
            InputBucketValue.set(Multiply(1000, InputAccuracy)),

            playNoteLaneEffect(),
            playNoteTapEffect(),
            playJudgmentSFX(),
        ]
    }
}
