import {
    Add,
    And,
    Divide,
    Draw,
    EntityInfo,
    EntityMemory,
    Equal,
    GreaterOr,
    Multiply,
    Or,
    SkinSprite,
    SScript,
    State,
    Subtract,
    Time,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import {
    laneYMultiplier,
    laneYOffset,
    Layer,
    noteBaseBottom,
    noteBaseTop,
    noteOnScreenDuration,
} from './common/constants'
import { approach, NoteData } from './common/note'

export function simLine(): SScript {
    const rightIndex = EntityMemory.to<number>(0)
    const leftIndex = Subtract(rightIndex, 1)

    const leftData = NoteData.of(leftIndex)
    const rightData = NoteData.of(rightIndex)

    const time = EntityMemory.to<number>(1)
    const spawnTime = EntityMemory.to<number>(2)

    const left = EntityMemory.to<number>(3)
    const right = EntityMemory.to<number>(4)

    const scale = EntityMemory.to<number>(5)
    const scaleBottom = EntityMemory.to<number>(6)
    const scaleTop = EntityMemory.to<number>(7)
    const bottom = EntityMemory.to<number>(8)
    const top = EntityMemory.to<number>(9)

    const initialize = [
        time.set(NoteData.of(rightIndex).time),
        spawnTime.set(Subtract(time, noteOnScreenDuration)),

        left.set(leftData.bottomCenter),
        right.set(rightData.bottomCenter),
    ]

    const updateParallel = Or(
        And(options.isAutoplay, GreaterOr(Time, time)),
        Equal(EntityInfo.of(leftIndex).state, State.Despawned),
        Equal(EntityInfo.of(rightIndex).state, State.Despawned),
        And(GreaterOr(Time, spawnTime), [
            scale.set(
                approach(Divide(Subtract(Time, time), noteOnScreenDuration))
            ),
            scaleBottom.set(Multiply(noteBaseBottom, scale)),
            scaleTop.set(Multiply(noteBaseTop, scale)),
            bottom.set(
                Add(laneYOffset, Multiply(laneYMultiplier, scaleBottom))
            ),
            top.set(Add(laneYOffset, Multiply(laneYMultiplier, scaleTop))),

            Draw(
                SkinSprite.SimultaneousConnectionCyan,
                Multiply(left, scaleBottom),
                bottom,
                Multiply(left, scaleTop),
                top,
                Multiply(right, scaleTop),
                top,
                Multiply(right, scaleBottom),
                bottom,
                Layer.SimLine,
                1
            ),
        ])
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
