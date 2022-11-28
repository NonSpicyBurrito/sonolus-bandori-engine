import { SkinSprite } from 'sonolus-core'
import {
    And,
    Draw,
    EntityInfo,
    EntityMemory,
    Equal,
    GreaterOr,
    Lerp,
    Multiply,
    Or,
    Script,
    State,
    Subtract,
    Time,
} from 'sonolus.js'
import { options } from '../../configuration/options'
import {
    Layer,
    noteBaseBottom,
    noteBaseBottomScale,
    noteBaseTop,
    noteBaseTopScale,
    stageTop,
} from './common/constants'
import { approach, getVisibleTime, getZ, NoteData } from './common/note'

export function simLine(): Script {
    const rightIndex = EntityMemory.to<number>(0)
    const leftIndex = Subtract(rightIndex, 1)

    const leftData = NoteData.of(leftIndex)
    const rightData = NoteData.of(rightIndex)

    const time = EntityMemory.to<number>(1)
    const visibleTime = EntityMemory.to<number>(2)

    const left = EntityMemory.to<number>(3)
    const right = EntityMemory.to<number>(4)

    const scale = EntityMemory.to<number>(5)
    const bottom = EntityMemory.to<number>(6)
    const top = EntityMemory.to<number>(7)

    const z = EntityMemory.to<number>(8)

    const initialize = [
        time.set(NoteData.of(rightIndex).time),
        visibleTime.set(getVisibleTime(time)),

        left.set(leftData.center),
        right.set(rightData.center),

        z.set(getZ(Layer.SimLine, time, rightIndex)),
    ]

    const updateParallel = Or(
        And(options.isAutoplay, GreaterOr(Time, time)),
        Equal(EntityInfo.of(leftIndex).state, State.Despawned),
        Equal(EntityInfo.of(rightIndex).state, State.Despawned),
        And(GreaterOr(Time, visibleTime), [
            scale.set(approach(time)),
            bottom.set(Lerp(stageTop, noteBaseBottom, scale)),
            top.set(Lerp(stageTop, noteBaseTop, scale)),

            Draw(
                SkinSprite.SimultaneousConnectionNeutral,
                Multiply(left, noteBaseBottomScale, scale),
                bottom,
                Multiply(left, noteBaseTopScale, scale),
                top,
                Multiply(right, noteBaseTopScale, scale),
                top,
                Multiply(right, noteBaseBottomScale, scale),
                bottom,
                z,
                1
            ),
        ])
    )

    return {
        initialize,
        updateParallel,
    }
}
