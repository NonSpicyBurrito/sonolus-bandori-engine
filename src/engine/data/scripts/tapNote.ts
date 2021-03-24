import {
    And,
    bool,
    Equal,
    Greater,
    GreaterOr,
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
    TouchST,
    TouchStarted,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import {
    goodWindow,
    greatWindow,
    inputOffset,
    perfectWindow,
} from './common/constants'
import {
    checkNoteTimeInGoodWindow,
    checkTouchXInNoteLane,
    drawNoteTail,
    InputState,
    NoteData,
    noteInputState,
    NoteSharedMemory,
    playNoteLaneEffect,
    playNoteTapEffect,
    setupAutoInput,
    setupAutoTapEffect,
    setupPreprocess,
    setupSimLine,
    updateNoteTailScale,
} from './common/note'
import { playJudgmentSFX } from './common/sfx'
import { checkTouchYInHitBox, isTouchOccupied } from './common/touch'

export function tapNote(bucket: number, sprite: SkinSprite): SScript {
    const preprocess = setupPreprocess()

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = [
        setupSimLine(),

        setupAutoInput(bucket),
        setupAutoTapEffect(),
    ]

    const touch = Or(
        options.isAutoplay,
        And(
            Not(bool(noteInputState)),
            checkNoteTimeInGoodWindow(),
            TouchStarted,
            Not(isTouchOccupied),
            checkTouchYInHitBox(),
            checkTouchXInNoteLane(),
            onComplete()
        )
    )

    const updateParallel = Or(
        And(options.isAutoplay, GreaterOr(Time, NoteData.time)),
        Equal(noteInputState, InputState.Terminated),
        Greater(Subtract(Time, NoteData.time, inputOffset), goodWindow),
        [updateNoteTailScale(), drawNoteTail(sprite)]
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
                    Subtract(TouchST, inputOffset),
                    NoteData.time,
                    perfectWindow,
                    greatWindow,
                    goodWindow
                )
            ),
            InputBucket.set(bucket + 1),
            InputBucketValue.set(
                Multiply(1000, Subtract(TouchST, inputOffset, NoteData.time))
            ),

            playNoteLaneEffect(),
            playNoteTapEffect(),
            playJudgmentSFX(),
        ]
    }
}
