import { SkinSprite } from 'sonolus-core'
import {
    Add,
    And,
    createEntityData,
    Divide,
    Draw,
    EntityInfo,
    EntityMemory,
    Equal,
    Greater,
    GreaterOr,
    If,
    Lerp,
    LessOr,
    Max,
    Min,
    Multiply,
    Or,
    Pointer,
    Script,
    State,
    Subtract,
    Time,
    Unlerp,
} from 'sonolus.js'
import { options } from '../../configuration/options'
import {
    halfNoteWidth,
    Layer,
    noteBaseBottom,
    noteBaseBottomScale,
    noteBaseTop,
    noteBaseTopScale,
    noteOnScreenDuration,
    noteWidth,
    stageBottom,
    stageTop,
} from './common/constants'
import { moveHoldEffect } from './common/effect'
import { approach, getZ, NoteSharedMemory } from './common/note'
import { getLaneBottomCenter } from './common/stage'

class SliderDataPointer extends Pointer {
    public get headIndex() {
        return this.to<number>(0)
    }

    public get tailIndex() {
        return this.to<number>(1)
    }

    public get headTime() {
        return this.to<number>(2)
    }

    public get tailTime() {
        return this.to<number>(3)
    }

    public get headLane() {
        return this.to<number>(4)
    }

    public get tailLane() {
        return this.to<number>(5)
    }
}

const SliderData = createEntityData(SliderDataPointer)

export function slider(sprite: SkinSprite): Script {
    const spawnTime = EntityMemory.to<number>(0)
    const headL = EntityMemory.to<number>(1)
    const headR = EntityMemory.to<number>(2)
    const tailL = EntityMemory.to<number>(3)
    const tailR = EntityMemory.to<number>(4)
    const connectorZ = EntityMemory.to<number>(5)
    const slideZ = EntityMemory.to<number>(6)

    const preprocess = [
        repositionTime(SliderData.headTime),
        repositionTime(SliderData.tailTime),
        mirror(SliderData.headLane),
        mirror(SliderData.tailLane),

        spawnTime.set(Subtract(SliderData.headTime, noteOnScreenDuration)),

        headL.set(
            Subtract(getLaneBottomCenter(SliderData.headLane), halfNoteWidth)
        ),
        headR.set(Add(headL, noteWidth)),
        tailL.set(
            Subtract(getLaneBottomCenter(SliderData.tailLane), halfNoteWidth)
        ),
        tailR.set(Add(tailL, noteWidth)),

        connectorZ.set(
            getZ(Layer.NoteConnector, SliderData.headTime, SliderData.headIndex)
        ),
        slideZ.set(
            getZ(Layer.NoteSlide, SliderData.headTime, SliderData.headIndex)
        ),
    ]

    const spawnOrder = spawnTime

    const shouldSpawn = GreaterOr(Time, spawnTime)

    const headTime = EntityMemory.to<number>(32)
    const tailTime = EntityMemory.to<number>(33)

    const headXScale = EntityMemory.to<number>(34)
    const tailXScale = EntityMemory.to<number>(35)
    const headYScale = EntityMemory.to<number>(36)
    const tailYScale = EntityMemory.to<number>(37)
    const b = EntityMemory.to<number>(38)
    const t = EntityMemory.to<number>(39)

    const slideScale = EntityMemory.to<number>(40)
    const slideCenter = EntityMemory.to<number>(41)
    const slideL = EntityMemory.to<number>(42)
    const slideR = EntityMemory.to<number>(43)

    const isSliding = Or(
        options.isAutoplay,
        NoteSharedMemory.of(SliderData.tailIndex).isSliding
    )

    const hiddenTime = Add(Time, Multiply(options.hidden, noteOnScreenDuration))

    const updateParallel = Or(
        Equal(EntityInfo.of(SliderData.tailIndex).state, State.Despawned),
        And(isSliding, Greater(Time, SliderData.tailTime)),
        [
            headTime.set(
                If(
                    isSliding,
                    Max(SliderData.headTime, Time),
                    SliderData.headTime
                )
            ),
            tailTime.set(
                Min(SliderData.tailTime, Add(Time, noteOnScreenDuration))
            ),

            And(Greater(options.hidden, 0), [
                headTime.set(Max(headTime, hiddenTime)),
                tailTime.set(Max(tailTime, hiddenTime)),
            ]),

            headXScale.set(
                Unlerp(SliderData.headTime, SliderData.tailTime, headTime)
            ),
            tailXScale.set(
                Unlerp(SliderData.headTime, SliderData.tailTime, tailTime)
            ),
            headYScale.set(approach(headTime)),
            tailYScale.set(approach(tailTime)),

            b.set(Lerp(stageTop, stageBottom, headYScale)),
            t.set(Lerp(stageTop, stageBottom, tailYScale)),

            Draw(
                sprite,
                Multiply(Lerp(headL, tailL, headXScale), headYScale),
                b,
                Multiply(Lerp(headL, tailL, tailXScale), tailYScale),
                t,
                Multiply(Lerp(headR, tailR, tailXScale), tailYScale),
                t,
                Multiply(Lerp(headR, tailR, headXScale), headYScale),
                b,
                connectorZ,
                options.connectorAlpha
            ),

            And(isSliding, GreaterOr(Time, SliderData.headTime), [
                slideScale.set(
                    Unlerp(SliderData.headTime, SliderData.tailTime, Time)
                ),

                slideL.set(Lerp(headL, tailL, slideScale)),
                slideR.set(Lerp(headR, tailR, slideScale)),

                And(
                    LessOr(options.hidden, 0),
                    Draw(
                        SkinSprite.NoteHeadGreen,
                        Multiply(slideL, noteBaseBottomScale),
                        noteBaseBottom,
                        Multiply(slideL, noteBaseTopScale),
                        noteBaseTop,
                        Multiply(slideR, noteBaseTopScale),
                        noteBaseTop,
                        Multiply(slideR, noteBaseBottomScale),
                        noteBaseBottom,
                        slideZ,
                        1
                    )
                ),

                And(options.isNoteEffectEnabled, [
                    slideCenter.set(Divide(Add(slideL, slideR), 2)),
                    moveHoldEffect(
                        NoteSharedMemory.of(SliderData.tailIndex),
                        slideCenter
                    ),
                ]),
            ]),
        ]
    )

    return {
        preprocess,
        spawnOrder,
        shouldSpawn,
        updateParallel,
    }

    function repositionTime(time: Pointer<number>) {
        return time.set(Divide(time, options.speed))
    }

    function mirror(lane: Pointer<number>) {
        return And(options.isMirrorEnabled, lane.set(Multiply(lane, -1)))
    }
}
