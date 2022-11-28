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
    Multiply,
    Or,
    Pointer,
    RemapClamped,
    Script,
    State,
    Subtract,
    Time,
} from 'sonolus.js'
import { options } from '../../configuration/options'
import {
    halfNoteWidth,
    laneBottom,
    Layer,
    noteBaseBottom,
    noteBaseBottomScale,
    noteBaseTop,
    noteBaseTopScale,
    noteWidth,
    stageBottom,
    stageTop,
} from './common/constants'
import { moveHoldEffect } from './common/effect'
import { approach, getVisibleTime, getZ, NoteSharedMemory } from './common/note'
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

    public get isFirst() {
        return this.to<boolean>(6)
    }

    public get spawnTime() {
        return this.to<number>(16)
    }

    public get headBottomLeft() {
        return this.to<number>(17)
    }

    public get headBottomRight() {
        return this.to<number>(18)
    }

    public get tailBottomLeft() {
        return this.to<number>(19)
    }

    public get tailBottomRight() {
        return this.to<number>(20)
    }
}

const SliderData = createEntityData(SliderDataPointer)

export function slider(sprite: SkinSprite): Script {
    const headScale = EntityMemory.to<number>(0)
    const slideBottom = EntityMemory.to<number>(1)
    const headCenter = EntityMemory.to<number>(2)
    const headLeft = EntityMemory.to<number>(3)
    const headRight = EntityMemory.to<number>(4)

    const tailScale = EntityMemory.to<number>(5)
    const slideTop = EntityMemory.to<number>(6)

    const connectorZ = EntityMemory.to<number>(7)
    const slideZ = EntityMemory.to<number>(8)

    const preprocess = [
        repositionTime(SliderData.headTime),
        repositionTime(SliderData.tailTime),
        mirror(SliderData.headLane),
        mirror(SliderData.tailLane),

        SliderData.headBottomLeft.set(
            Subtract(getLaneBottomCenter(SliderData.headLane), halfNoteWidth)
        ),
        SliderData.headBottomRight.set(
            Add(SliderData.headBottomLeft, noteWidth)
        ),
        SliderData.tailBottomLeft.set(
            Subtract(getLaneBottomCenter(SliderData.tailLane), halfNoteWidth)
        ),
        SliderData.tailBottomRight.set(
            Add(SliderData.tailBottomLeft, noteWidth)
        ),

        SliderData.spawnTime.set(getVisibleTime(SliderData.headTime)),

        connectorZ.set(
            getZ(Layer.NoteConnector, SliderData.headTime, SliderData.headIndex)
        ),
        slideZ.set(
            getZ(Layer.NoteSlide, SliderData.headTime, SliderData.headIndex)
        ),
    ]

    const spawnOrder = SliderData.spawnTime

    const shouldSpawn = GreaterOr(Time, SliderData.spawnTime)

    const initialize = [
        headLeft.set(SliderData.headBottomLeft),
        headRight.set(SliderData.headBottomRight),
    ]

    const updateParallel = Or(
        Equal(EntityInfo.of(SliderData.tailIndex).state, State.Despawned),
        Greater(Time, SliderData.tailTime),
        [
            If(
                Or(
                    If(
                        SliderData.isFirst,
                        NoteSharedMemory.of(SliderData.tailIndex).isSliding,
                        GreaterOr(Time, SliderData.headTime)
                    ),
                    And(
                        options.isAutoplay,
                        GreaterOr(Time, SliderData.headTime)
                    )
                ),
                [
                    headScale.set(1),
                    slideBottom.set(laneBottom),

                    headLeft.set(
                        RemapClamped(
                            SliderData.headTime,
                            SliderData.tailTime,
                            SliderData.headBottomLeft,
                            SliderData.tailBottomLeft,
                            Time
                        )
                    ),
                    headRight.set(Add(headLeft, noteWidth)),

                    Draw(
                        SkinSprite.NoteHeadGreen,
                        Multiply(headLeft, noteBaseBottomScale),
                        noteBaseBottom,
                        Multiply(headLeft, noteBaseTopScale),
                        noteBaseTop,
                        Multiply(headRight, noteBaseTopScale),
                        noteBaseTop,
                        Multiply(headRight, noteBaseBottomScale),
                        noteBaseBottom,
                        slideZ,
                        1
                    ),

                    And(options.isNoteEffectEnabled, [
                        headCenter.set(Divide(Add(headLeft, headRight), 2)),
                        moveHoldEffect(
                            NoteSharedMemory.of(SliderData.tailIndex),
                            headCenter
                        ),
                    ]),
                ],
                [
                    headScale.set(approach(SliderData.headTime)),
                    slideBottom.set(Lerp(stageTop, stageBottom, headScale)),
                ]
            ),

            tailScale.set(approach(SliderData.tailTime)),
            slideTop.set(Lerp(stageTop, stageBottom, tailScale)),

            Draw(
                sprite,
                Multiply(headLeft, headScale),
                slideBottom,
                Multiply(SliderData.tailBottomLeft, tailScale),
                slideTop,
                Multiply(SliderData.tailBottomRight, tailScale),
                slideTop,
                Multiply(headRight, headScale),
                slideBottom,
                connectorZ,
                options.connectorAlpha
            ),
        ]
    )

    return {
        preprocess,
        spawnOrder,
        shouldSpawn,
        initialize,
        updateParallel,
    }

    function repositionTime(time: Pointer<number>) {
        return time.set(Divide(time, options.speed))
    }

    function mirror(lane: Pointer<number>) {
        return And(options.isMirrorEnabled, lane.set(Multiply(lane, -1)))
    }
}
