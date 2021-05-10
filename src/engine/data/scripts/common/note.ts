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
    ParticleEffect,
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
    laneWidth,
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
    playNoteEffect,
    spawnHoldEffect,
} from './effect'
import { getLaneBottomCenter } from './stage'
import {
    checkTouchXInLane,
    checkTouchXInLanes,
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

    public get width() {
        return this.to<number>(3)
    }

    public get speedMultiplier() {
        return this.to<number>(16)
    }

    public get spawnTime() {
        return this.to<number>(17)
    }

    public get bottomCenter() {
        return this.to<number>(18)
    }

    public get bottomLeft() {
        return this.to<number>(19)
    }

    public get bottomRight() {
        return this.to<number>(20)
    }

    public get z() {
        return this.to<number>(21)
    }

    public get isStraightSlide() {
        return this.to<boolean>(22)
    }

    public get originalLane() {
        return this.to<number>(23)
    }

    public get slideSpawnTime() {
        return this.to<number>(24)
    }

    public get arrowOffset() {
        return this.to<number>(24)
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
    return playNoteEffect(
        NoteData.bottomCenter,
        ParticleEffect.NoteLinearTapCyan,
        ParticleEffect.NoteCircularTapCyan,
        0
    )
}
export function playNoteFlickEffect() {
    return playNoteEffect(
        NoteData.bottomCenter,
        ParticleEffect.NoteLinearAlternativeRed,
        ParticleEffect.NoteCircularAlternativeRed,
        0
    )
}
export function playNoteLeftDirectionalFlickEffect() {
    return playNoteEffect(
        NoteData.bottomCenter,
        ParticleEffect.NoteLinearAlternativePurple,
        ParticleEffect.NoteCircularAlternativePurple,
        -1
    )
}
export function playNoteRightDirectionalFlickEffect() {
    return playNoteEffect(
        NoteData.bottomCenter,
        ParticleEffect.NoteLinearAlternativeYellow,
        ParticleEffect.NoteCircularAlternativeYellow,
        1
    )
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
export function checkTouchXInNoteLanes(isLeft: boolean) {
    return isLeft
        ? checkTouchXInLanes(
              Subtract(
                  NoteData.bottomCenter,
                  Multiply(laneWidth, Subtract(NoteData.width, 1))
              ),
              NoteData.bottomCenter
          )
        : checkTouchXInLanes(
              NoteData.bottomCenter,
              Add(
                  NoteData.bottomCenter,
                  Multiply(laneWidth, Subtract(NoteData.width, 1))
              )
          )
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
export function approachNote(
    time: Code<number>,
    speedMultiplier: Code<number>
) {
    return approach(
        Divide(Subtract(Time, time), noteOnScreenDuration, speedMultiplier)
    )
}

export function getSpawnTime(
    time: Code<number>,
    speedMultiplier: Code<number>
) {
    return Subtract(time, Multiply(noteOnScreenDuration, speedMultiplier))
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
            getSpawnTime(NoteData.time, NoteData.speedMultiplier)
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

        NoteData.slideSpawnTime.set(
            Min(NoteData.spawnTime, NoteData.head.spawnTime)
        ),
    ]
}

export function setupArrowOffset(isLeft: boolean) {
    return NoteData.arrowOffset.set(
        Multiply(
            laneWidth,
            isLeft ? Multiply(-1, NoteData.width) : NoteData.width
        )
    )
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
            Equal(leftArchetype, archetypes.leftDirectionalFlickNoteIndex),
            Equal(leftArchetype, archetypes.rightDirectionalFlickNoteIndex),
            Equal(leftArchetype, archetypes.slideStartNoteIndex),
            Equal(leftArchetype, archetypes.slideEndNoteIndex),
            Equal(leftArchetype, archetypes.slideFlickNoteIndex)
        ),
        Spawn(scripts.simLineIndex, [EntityInfo.index])
    )
}

export function setupAutoTapEffect() {
    return setupAutoNoteEffect(scripts.autoTapEffectIndex)
}
export function setupAutoFlickEffect() {
    return setupAutoNoteEffect(scripts.autoFlickEffectIndex)
}
export function setupAutoLeftDirectionalFlickEffect() {
    return setupAutoNoteEffect(scripts.autoLeftDirectionalFlickEffectIndex)
}
export function setupAutoRightDirectionalFlickEffect() {
    return setupAutoNoteEffect(scripts.autoRightDirectionalFlickEffectIndex)
}
function setupAutoNoteEffect(index: number) {
    return And(options.isAutoplay, Spawn(index, [EntityInfo.index]))
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
    return noteTailScale.set(
        approachNote(NoteData.time, NoteData.speedMultiplier)
    )
}
export function updateSlideNoteTailScale() {
    return If(
        And(NoteSharedMemory.isSliding, GreaterOr(Time, NoteData.time)),
        noteTailScale.set(1),
        updateNoteTailScale()
    )
}

export function drawNoteTail(
    sprite: SkinSprite,
    offset?: Code<number>,
    rotateLeft?: boolean
) {
    const noteTailScaleBottom = EntityMemory.to<number>(48)
    const noteTailScaleTop = EntityMemory.to<number>(49)

    const noteTailBottom = EntityMemory.to<number>(50)
    const noteTailTop = EntityMemory.to<number>(51)

    const noteTailBottomLeft = offset
        ? Add(NoteData.bottomLeft, Multiply(offset, laneWidth))
        : NoteData.bottomLeft
    const noteTailBottomRight = offset
        ? Add(NoteData.bottomRight, Multiply(offset, laneWidth))
        : NoteData.bottomRight

    return [
        noteTailScaleBottom.set(Multiply(noteBaseBottom, noteTailScale)),
        noteTailScaleTop.set(Multiply(noteBaseTop, noteTailScale)),

        noteTailBottom.set(
            Add(laneYOffset, Multiply(laneYMultiplier, noteTailScaleBottom))
        ),
        noteTailTop.set(
            Add(laneYOffset, Multiply(laneYMultiplier, noteTailScaleTop))
        ),

        !offset
            ? Draw(
                  sprite,
                  Multiply(noteTailScaleBottom, noteTailBottomLeft),
                  noteTailBottom,
                  Multiply(noteTailScaleTop, noteTailBottomLeft),
                  noteTailTop,
                  Multiply(noteTailScaleTop, noteTailBottomRight),
                  noteTailTop,
                  Multiply(noteTailScaleBottom, noteTailBottomRight),
                  noteTailBottom,
                  NoteData.z,
                  1
              )
            : rotateLeft
            ? Draw(
                  sprite,
                  Multiply(noteTailScaleBottom, noteTailBottomRight),
                  noteTailBottom,
                  Multiply(noteTailScaleBottom, noteTailBottomLeft),
                  noteTailBottom,
                  Multiply(noteTailScaleTop, noteTailBottomLeft),
                  noteTailTop,
                  Multiply(noteTailScaleTop, noteTailBottomRight),
                  noteTailTop,
                  NoteData.z,
                  1
              )
            : Draw(
                  sprite,
                  Multiply(noteTailScaleTop, noteTailBottomLeft),
                  noteTailTop,
                  Multiply(noteTailScaleTop, noteTailBottomRight),
                  noteTailTop,
                  Multiply(noteTailScaleBottom, noteTailBottomRight),
                  noteTailBottom,
                  Multiply(noteTailScaleBottom, noteTailBottomLeft),
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

export function drawNoteTailDirectionalArrow(
    sprite: SkinSprite,
    isLeft: boolean
) {
    const arrowX = EntityMemory.to<number>(48)
    const arrowY = EntityMemory.to<number>(49)
    const arrowRadius = EntityMemory.to<number>(50)

    const arrowLeft = Subtract(arrowX, arrowRadius)
    const arrowRight = Add(arrowX, arrowRadius)
    const arrowBottom = Subtract(arrowY, arrowRadius)
    const arrowTop = Add(arrowY, arrowRadius)

    return [
        arrowX.set(
            Multiply(
                noteTailScale,
                Add(NoteData.bottomCenter, NoteData.arrowOffset)
            )
        ),
        arrowY.set(Add(laneYOffset, Multiply(laneYMultiplier, noteTailScale))),
        arrowRadius.set(Multiply(noteTailScale, halfNoteWidth)),

        isLeft
            ? Draw(
                  sprite,
                  arrowRight,
                  arrowBottom,
                  arrowLeft,
                  arrowBottom,
                  arrowLeft,
                  arrowTop,
                  arrowRight,
                  arrowTop,
                  layerNoteMarker,
                  1
              )
            : Draw(
                  sprite,
                  arrowLeft,
                  arrowTop,
                  arrowRight,
                  arrowTop,
                  arrowRight,
                  arrowBottom,
                  arrowLeft,
                  arrowBottom,
                  layerNoteMarker,
                  1
              ),
    ]
}
