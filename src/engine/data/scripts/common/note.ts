import {
    Abs,
    Add,
    And,
    bool,
    Code,
    createEntityData,
    createEntitySharedMemory,
    Divide,
    Draw,
    EntityInfo,
    EntityMemory,
    Equal,
    Greater,
    GreaterOr,
    If,
    InputBucket,
    InputJudgment,
    Less,
    LessOr,
    LevelMemory,
    Max,
    Min,
    Multiply,
    Not,
    Or,
    Pointer,
    Power,
    Random,
    RandomInteger,
    SkinSprite,
    Spawn,
    State,
    Subtract,
    Time,
    TouchEnded,
    TouchId,
} from 'sonolus.js'

import { options } from '../../../configuration/options'
import { archetypes } from '../../archetypes'
import { scripts } from '..'
import {
    audioOffset,
    goodWindow,
    halfNoteWidth,
    inputOffset,
    laneYMultiplier,
    laneYOffset,
    layerNoteBody,
    layerNoteMarker,
    noteBaseBottom,
    noteBaseTop,
    noteOnScreenDuration,
    noteWidth,
} from './constants'
import {
    destroyHoldEffect,
    playLaneEffect,
    playTapOrFlickEffect,
    spawnHoldEffect,
} from './effect'
import { getLaneBottomCenter } from './stage'
import {
    checkTouchXInLane,
    checkTouchYInHitBox,
    isTouchOccupied,
} from './touch'

export enum InputState {
    Waiting,
    Activated,
    ActivatedNext,
    Terminated,
}

// Data

export class NoteDataPointer extends Pointer {
    public get head() {
        return NoteData.of(this.headIndex)
    }

    public get headIndex() {
        return this.to<number>(0)
    }

    public get time() {
        return this.to<number>(1)
    }

    public get lane() {
        return this.to<number>(2)
    }

    public get speedMultiplier() {
        return this.to<number>(3)
    }

    public get spawnTime() {
        return this.to<number>(4)
    }

    public get bottomCenter() {
        return this.to<number>(5)
    }

    public get bottomLeft() {
        return this.to<number>(6)
    }

    public get bottomRight() {
        return this.to<number>(7)
    }

    public get z() {
        return this.to<number>(8)
    }

    public get isStraightSlide() {
        return this.to<boolean>(9)
    }

    public get originalLane() {
        return this.to<number>(10)
    }
}

export const NoteData = createEntityData(NoteDataPointer)

// Shared Memory

export class NoteSharedMemoryPointer extends Pointer {
    public get head() {
        return NoteSharedMemory.of(NoteData.headIndex)
    }

    public get isInputSuccess() {
        return this.to<boolean>(0)
    }

    public get inputTouchId() {
        return this.to<number>(1)
    }

    public get isSliding() {
        return this.to<boolean>(2)
    }

    public get linearHoldEffectId() {
        return this.to<number>(3)
    }

    public get circularHoldEffectId() {
        return this.to<number>(4)
    }
}

export const NoteSharedMemory = createEntitySharedMemory(
    NoteSharedMemoryPointer
)

// Memory

export const noteTailScale = EntityMemory.to<number>(32)
export const noteInputState = EntityMemory.to<InputState>(33)

// Effect

export function playNoteLaneEffect() {
    return playLaneEffect(NoteData.lane)
}

export function playNoteTapEffect() {
    return playTapOrFlickEffect(NoteData.bottomCenter, false)
}
export function playNoteFlickEffect() {
    return playTapOrFlickEffect(NoteData.bottomCenter, true)
}

function spawnNoteHoldEffect() {
    return spawnHoldEffect(NoteSharedMemory, NoteData.head.bottomCenter)
}

export function destroyNoteHoldEffect() {
    return destroyHoldEffect(NoteSharedMemory)
}

// Touch

export function checkTouchXInNoteLane() {
    return checkTouchXInLane(NoteData.bottomCenter)
}

export function checkNoteTimeInGoodWindow() {
    return LessOr(
        Subtract(NoteData.time, Subtract(Time, inputOffset)),
        goodWindow
    )
}

// Note

export function approach(x: Code<number>) {
    return Add(0.05, Multiply(0.95, Power(117.39085, x)))
}
export function approachNote(noteData: NoteDataPointer) {
    return approach(
        Divide(
            Subtract(Time, noteData.time),
            noteOnScreenDuration,
            noteData.speedMultiplier
        )
    )
}

export function setupPreprocess() {
    const minLane = LevelMemory.to<number>(0)
    const maxLane = LevelMemory.to<number>(1)
    const slideRange = LevelMemory.to<number>(2)

    const prevNoteData = NoteData.of(Subtract(EntityInfo.index, 1))

    return [
        NoteData.time.set(
            Divide(Add(NoteData.time, audioOffset), options.speed)
        ),
        And(
            options.isMirrorEnabled,
            NoteData.lane.set(Multiply(NoteData.lane, -1))
        ),

        NoteData.speedMultiplier.set(
            If(options.isNoteSpeedRandom, Random(1, 2), 1)
        ),
        NoteData.spawnTime.set(
            Subtract(
                NoteData.time,
                Multiply(noteOnScreenDuration, NoteData.speedMultiplier)
            )
        ),

        And(options.isRandom, [
            NoteData.originalLane.set(NoteData.lane),

            minLane.set(Max(-3, Add(NoteData.lane, -2))),
            maxLane.set(Min(3, Add(NoteData.lane, 2))),

            And(
                Or(
                    Equal(EntityInfo.archetype, archetypes.slideTickNoteIndex),
                    Equal(EntityInfo.archetype, archetypes.slideEndNoteIndex),
                    Equal(EntityInfo.archetype, archetypes.slideFlickNoteIndex)
                ),
                [
                    slideRange.set(
                        Add(
                            1,
                            Abs(
                                Subtract(
                                    NoteData.originalLane,
                                    NoteData.head.originalLane
                                )
                            )
                        )
                    ),

                    minLane.set(
                        Max(minLane, Subtract(NoteData.head.lane, slideRange))
                    ),
                    maxLane.set(
                        Min(maxLane, Add(NoteData.head.lane, slideRange))
                    ),
                ]
            ),

            And(
                Equal(NoteData.time, prevNoteData.time),
                If(
                    Greater(prevNoteData.originalLane, NoteData.originalLane),
                    If(
                        Greater(prevNoteData.lane, minLane),
                        maxLane.set(Max(minLane, Add(prevNoteData.lane, -2))),
                        minLane.set(Min(maxLane, Add(prevNoteData.lane, 2)))
                    ),
                    If(
                        Less(prevNoteData.lane, maxLane),
                        minLane.set(Min(maxLane, Add(prevNoteData.lane, 2))),
                        maxLane.set(Max(minLane, Add(prevNoteData.lane, -2)))
                    )
                )
            ),

            NoteData.lane.set(RandomInteger(minLane, Add(maxLane, 1))),
        ]),

        NoteData.bottomCenter.set(getLaneBottomCenter(NoteData.lane)),
        NoteData.bottomLeft.set(Subtract(NoteData.bottomCenter, halfNoteWidth)),
        NoteData.bottomRight.set(Add(NoteData.bottomCenter, halfNoteWidth)),

        NoteData.z.set(Subtract(layerNoteBody, Divide(NoteData.time, 1000))),

        NoteData.isStraightSlide.set(Equal(NoteData.lane, NoteData.head.lane)),
    ]
}

export function setupAutoInput(bucket: number) {
    return And(options.isAutoplay, [
        InputJudgment.set(1),
        InputBucket.set(bucket + 1),
    ])
}

export function setupSimLine() {
    const leftIndex = Subtract(EntityInfo.index, 1)
    const leftArchetype = EntityInfo.of(leftIndex).archetype

    return And(
        options.isSimLineEnabled,
        Not(options.isNoteSpeedRandom),
        Equal(NoteData.time, NoteData.of(leftIndex).time),
        Or(
            Equal(leftArchetype, archetypes.tapNoteIndex),
            Equal(leftArchetype, archetypes.flickNoteIndex),
            Equal(leftArchetype, archetypes.slideStartNoteIndex),
            Equal(leftArchetype, archetypes.slideEndNoteIndex),
            Equal(leftArchetype, archetypes.slideFlickNoteIndex)
        ),
        Spawn(scripts.simLineIndex, [EntityInfo.index])
    )
}

export function setupSlider() {
    return Spawn(scripts.sliderIndex, [EntityInfo.index])
}

export function setupAutoTapEffect() {
    return setupAutoTapOrFlickEffect(false)
}
export function setupAutoFlickEffect() {
    return setupAutoTapOrFlickEffect(true)
}
function setupAutoTapOrFlickEffect(isFlick: boolean) {
    return And(
        options.isAutoplay,
        Spawn(
            isFlick ? scripts.autoFlickEffectIndex : scripts.autoTapEffectIndex,
            [EntityInfo.index]
        )
    )
}

export function setupAutoSlider() {
    return And(
        options.isAutoplay,
        Spawn(scripts.autoSliderIndex, [EntityInfo.index])
    )
}

export function processTouchHead() {
    const noteHeadInfo = EntityInfo.of(NoteData.headIndex)

    return And(
        Not(bool(noteInputState)),
        If(
            NoteSharedMemory.head.isInputSuccess,
            And(
                Equal(TouchId, NoteSharedMemory.head.inputTouchId),
                Not(TouchEnded),
                [
                    isTouchOccupied.set(true),
                    noteInputState.set(InputState.Activated),

                    NoteSharedMemory.inputTouchId.set(TouchId),
                    NoteSharedMemory.isSliding.set(true),

                    spawnNoteHoldEffect(),
                ]
            ),
            And(
                Equal(noteHeadInfo.state, State.Despawned),
                GreaterOr(Subtract(Time, inputOffset), NoteData.head.time),
                Not(isTouchOccupied),
                checkTouchYInHitBox(),
                checkTouchXInLane(NoteData.head.bottomCenter),
                [
                    isTouchOccupied.set(true),
                    noteInputState.set(InputState.Activated),

                    NoteSharedMemory.inputTouchId.set(TouchId),
                    NoteSharedMemory.isSliding.set(true),

                    spawnNoteHoldEffect(),
                ]
            )
        )
    )
}

export function processTouchDiscontinue() {
    return And(TouchEnded, noteInputState.set(InputState.Terminated))
}

export function updateNoteTailScale() {
    return noteTailScale.set(approachNote(NoteData))
}
export function updateSlideNoteTailScale() {
    return If(
        And(NoteSharedMemory.isSliding, GreaterOr(Time, NoteData.time)),
        noteTailScale.set(1),
        updateNoteTailScale()
    )
}

export function drawNoteTail(sprite: SkinSprite) {
    const noteTailScaleBottom = EntityMemory.to<number>(48)
    const noteTailScaleTop = EntityMemory.to<number>(49)

    const noteTailBottom = EntityMemory.to<number>(50)
    const noteTailTop = EntityMemory.to<number>(51)

    return [
        noteTailScaleBottom.set(Multiply(noteBaseBottom, noteTailScale)),
        noteTailScaleTop.set(Multiply(noteBaseTop, noteTailScale)),

        noteTailBottom.set(
            Add(laneYOffset, Multiply(laneYMultiplier, noteTailScaleBottom))
        ),
        noteTailTop.set(
            Add(laneYOffset, Multiply(laneYMultiplier, noteTailScaleTop))
        ),

        Draw(
            sprite,
            Multiply(noteTailScaleBottom, NoteData.bottomLeft),
            noteTailBottom,
            Multiply(noteTailScaleTop, NoteData.bottomLeft),
            noteTailTop,
            Multiply(noteTailScaleTop, NoteData.bottomRight),
            noteTailTop,
            Multiply(noteTailScaleBottom, NoteData.bottomRight),
            noteTailBottom,
            NoteData.z,
            1
        ),
    ]
}

export function drawNoteTailArrow() {
    const arrowLeft = EntityMemory.to<number>(48)
    const arrowRight = EntityMemory.to<number>(49)

    const arrowBottom = EntityMemory.to<number>(50)
    const arrowTop = EntityMemory.to<number>(51)

    return [
        arrowLeft.set(Multiply(noteTailScale, NoteData.bottomLeft)),
        arrowRight.set(Multiply(noteTailScale, NoteData.bottomRight)),

        arrowBottom.set(
            Add(laneYOffset, Multiply(laneYMultiplier, noteTailScale))
        ),
        arrowTop.set(Add(arrowBottom, Multiply(noteTailScale, noteWidth))),

        Draw(
            SkinSprite.DirectionalMarkerRed,
            arrowLeft,
            arrowBottom,
            arrowLeft,
            arrowTop,
            arrowRight,
            arrowTop,
            arrowRight,
            arrowBottom,
            layerNoteMarker,
            1
        ),
    ]
}
