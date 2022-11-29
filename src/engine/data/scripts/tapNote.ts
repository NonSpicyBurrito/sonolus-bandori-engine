import { SkinSprite } from 'sonolus-core'
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
    Script,
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
    updateNoteScale,
} from './common/note'
import { playJudgmentSFX } from './common/sfx'
import { checkTouchYInHitbox, isTouchOccupied } from './common/touch'

export function tapNote(bucket: number, sprite: SkinSprite): Script {
    const preprocess = preprocessNote(false, goodWindow)

    const spawnOrder = NoteData.spawnTime

    const shouldSpawn = GreaterOr(Time, NoteData.spawnTime)

    const initialize = initializeNote(
        bucket,
        scripts.autoTapNoteIndex,
        false,
        true
    )

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
        And(GreaterOr(Time, NoteData.visibleTime), isNotHidden(), [
            updateNoteScale(),
            prepareDrawNote(),
            drawNote(sprite),
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
