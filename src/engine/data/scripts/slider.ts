import {
    Add,
    And,
    Divide,
    Draw,
    EntityInfo,
    EntityMemory,
    Equal,
    Greater,
    GreaterOr,
    If,
    Multiply,
    Or,
    RemapClamped,
    SkinSprite,
    SScript,
    State,
    Subtract,
    Time,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import {
    halfNoteHeight,
    laneBottom,
    laneYMultiplier,
    laneYOffset,
    layerNoteConnector,
    layerNoteSlide,
    noteBaseBottom,
    noteBaseTop,
    noteWidth,
} from './common/constants'
import { moveHoldEffect } from './common/effect'
import { approachNote, NoteData, NoteSharedMemory } from './common/note'

export function slider(): SScript {
    const tailIndex = EntityMemory.to<number>(0)

    const tailData = NoteData.of(tailIndex)
    const headData = tailData.head

    const headScale = EntityMemory.to<number>(1)
    const slideBottom = EntityMemory.to<number>(2)
    const headCenter = EntityMemory.to<number>(3)
    const headLeft = EntityMemory.to<number>(4)
    const headRight = EntityMemory.to<number>(5)

    const tailScale = EntityMemory.to<number>(6)
    const slideTop = EntityMemory.to<number>(7)

    const initialize = [
        headLeft.set(headData.bottomLeft),
        headRight.set(headData.bottomRight),
    ]

    const updateParallel = Or(
        Equal(EntityInfo.of(tailIndex).state, State.Despawned),
        Greater(Time, tailData.time),
        [
            If(
                Or(
                    NoteSharedMemory.of(tailIndex).isSliding,
                    And(options.isAutoplay, GreaterOr(Time, headData.time))
                ),
                [
                    headScale.set(1),
                    slideBottom.set(laneBottom),

                    headLeft.set(
                        RemapClamped(
                            headData.time,
                            tailData.time,
                            headData.bottomLeft,
                            tailData.bottomLeft,
                            Time
                        )
                    ),
                    headRight.set(Add(headLeft, noteWidth)),

                    Draw(
                        SkinSprite.NoteHeadGreen,
                        Multiply(headLeft, noteBaseBottom),
                        Subtract(laneBottom, halfNoteHeight),
                        Multiply(headLeft, noteBaseTop),
                        Add(laneBottom, halfNoteHeight),
                        Multiply(headRight, noteBaseTop),
                        Add(laneBottom, halfNoteHeight),
                        Multiply(headRight, noteBaseBottom),
                        Subtract(laneBottom, halfNoteHeight),
                        layerNoteSlide,
                        1
                    ),

                    And(options.isNoteEffectEnabled, [
                        headCenter.set(Divide(Add(headLeft, headRight), 2)),
                        moveHoldEffect(
                            NoteSharedMemory.of(tailIndex),
                            headCenter
                        ),
                    ]),
                ],
                [
                    headScale.set(approachNote(headData)),
                    slideBottom.set(
                        Add(laneYOffset, Multiply(laneYMultiplier, headScale))
                    ),
                ]
            ),

            tailScale.set(approachNote(tailData)),
            slideTop.set(
                Add(laneYOffset, Multiply(laneYMultiplier, tailScale))
            ),

            Draw(
                SkinSprite.NoteConnectionGreen,
                Multiply(headLeft, headScale),
                slideBottom,
                Multiply(tailData.bottomLeft, tailScale),
                slideTop,
                Multiply(tailData.bottomRight, tailScale),
                slideTop,
                Multiply(headRight, headScale),
                slideBottom,
                layerNoteConnector,
                options.connectorAlpha
            ),
        ]
    )

    return {
        initialize: {
            code: initialize,
        },
        updateParallel: {
            code: updateParallel,
        },
    }
}
