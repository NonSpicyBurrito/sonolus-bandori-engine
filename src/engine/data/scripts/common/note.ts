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
    Layer,
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
    checkTouchXInHitbox,
    checkTouchYInHitbox,
    isTouchOccupied,
} from './touch'
import { rectByEdge, rectBySize, rotate } from './utils'

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

    public get extraWidth() {
        return this.to<number>(3)
    }

    public get isLeft() {
        return this.to<boolean>(4)
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
        return this.to<number>(25)
    }

    public get hitboxLeft() {
        return this.to<number>(26)
    }

    public get hitboxRight() {
        return this.to<number>(27)
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

export const noteScale = EntityMemory.to<number>(32)
export const noteInputState = EntityMemory.to<InputState>(33)

export const noteScaleBottom = EntityMemory.to<number>(48)
export const noteScaleTop = EntityMemory.to<number>(49)
export const noteBottom = EntityMemory.to<number>(50)
export const noteTop = EntityMemory.to<number>(51)

// Effect

export function playNoteLaneEffect() {
    return playLaneEffect(NoteData.lane)
}

export function playNoteTapEffect() {
    return playNoteEffect(
        NoteData.bottomCenter,
        ParticleEffect.NoteLinearTapCyan,
        ParticleEffect.NoteCircularTapCyan,
        'up'
    )
}
export function playNoteFlickEffect() {
    return playNoteEffect(
        NoteData.bottomCenter,
        ParticleEffect.NoteLinearAlternativeRed,
        ParticleEffect.NoteCircularAlternativeRed,
        'up'
    )
}
export function playNoteLeftDirectionalFlickEffect() {
    return playNoteEffect(
        NoteData.bottomCenter,
        ParticleEffect.NoteLinearAlternativePurple,
        ParticleEffect.NoteCircularAlternativePurple,
        'left'
    )
}
export function playNoteRightDirectionalFlickEffect() {
    return playNoteEffect(
        NoteData.bottomCenter,
        ParticleEffect.NoteLinearAlternativeYellow,
        ParticleEffect.NoteCircularAlternativeYellow,
        'right'
    )
}

function spawnNoteHoldEffect() {
    return spawnHoldEffect(NoteSharedMemory, NoteData.head.bottomCenter)
}

export function destroyNoteHoldEffect() {
    return destroyHoldEffect(NoteSharedMemory)
}

// Touch

export function checkTouchXInNoteHitbox(noteData: NoteDataPointer = NoteData) {
    return checkTouchXInHitbox(noteData.hitboxLeft, noteData.hitboxRight)
}

export function checkNoteTimeInGoodWindow() {
    return LessOr(
        Subtract(NoteData.time, Subtract(Time, inputOffset)),
        goodWindow
    )
}

// Note

export function approach(x: Code<number>) {
    return Add(0.05, Multiply(0.95, Power(1.1 ** 50, x)))
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

export function preprocessNote() {
    const minLane = LevelMemory.to<number>(0)
    const maxLane = LevelMemory.to<number>(1)
    const slideRange = LevelMemory.to<number>(2)

    const prevNoteData = NoteData.of(Subtract(EntityInfo.index, 1))

    return [
        NoteData.time.set(
            Divide(Add(NoteData.time, audioOffset), options.speed)
        ),
        And(options.isMirrorEnabled, [
            NoteData.lane.set(Multiply(NoteData.lane, -1)),
            NoteData.isLeft.set(Not(NoteData.isLeft)),
        ]),

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

        NoteData.hitboxLeft.set(
            Subtract(
                NoteData.bottomCenter,
                Multiply(
                    laneWidth,
                    If(NoteData.isLeft, Add(1.175, NoteData.extraWidth), 1.175)
                )
            )
        ),
        NoteData.hitboxRight.set(
            Add(
                NoteData.bottomCenter,
                Multiply(
                    laneWidth,
                    If(NoteData.isLeft, 1.175, Add(1.175, NoteData.extraWidth))
                )
            )
        ),

        NoteData.z.set(Subtract(Layer.NoteBody, Divide(NoteData.time, 1000))),
    ]
}

export function preprocessIsStraightSlide() {
    return NoteData.isStraightSlide.set(
        Equal(NoteData.lane, NoteData.head.lane)
    )
}

export function preprocessSlideSpawnTime() {
    return NoteData.slideSpawnTime.set(
        Min(NoteData.spawnTime, NoteData.head.spawnTime)
    )
}

export function preprocessArrowOffset() {
    const offset = Add(Multiply(laneWidth, NoteData.extraWidth), noteWidth)

    return NoteData.arrowOffset.set(
        If(NoteData.isLeft, Multiply(-1, offset), offset)
    )
}

export function initializeNoteAutoInput(bucket: Code<number>) {
    return And(options.isAutoplay, [
        InputJudgment.set(1),
        InputBucket.set(Add(bucket, 1)),
    ])
}

export function initializeNoteSimLine() {
    const leftIndex = Subtract(EntityInfo.index, 1)
    const leftArchetype = EntityInfo.of(leftIndex).archetype

    return And(
        options.isSimLineEnabled,
        Not(options.isNoteSpeedRandom),
        Equal(NoteData.time, NoteData.of(leftIndex).time),
        Or(
            ...[
                archetypes.tapNoteIndex,
                archetypes.flickNoteIndex,
                archetypes.directionalFlickNoteIndex,
                archetypes.slideStartNoteIndex,
                archetypes.slideEndNoteIndex,
                archetypes.slideFlickNoteIndex,
            ].map((index) => Equal(leftArchetype, index))
        ),
        Spawn(scripts.simLineIndex, [EntityInfo.index])
    )
}

export function initializeNoteAutoEffect(index: Code<number>) {
    return And(options.isAutoplay, Spawn(index, [EntityInfo.index]))
}

export function initializeAutoSlider() {
    return And(
        options.isAutoplay,
        Spawn(scripts.autoSliderIndex, [EntityInfo.index])
    )
}

export function touchProcessHead() {
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
                checkTouchYInHitbox(),
                checkTouchXInNoteHitbox(NoteData.head),
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

export function touchProcessDiscontinue() {
    return And(TouchEnded, noteInputState.set(InputState.Terminated))
}

export function updateNoteScale() {
    return noteScale.set(approachNote(NoteData.time, NoteData.speedMultiplier))
}
export function updateNoteSlideScale() {
    return If(
        And(NoteSharedMemory.isSliding, GreaterOr(Time, NoteData.time)),
        noteScale.set(1),
        updateNoteScale()
    )
}

export function prepareDrawNote() {
    return [
        noteScaleBottom.set(Multiply(noteBaseBottom, noteScale)),
        noteScaleTop.set(Multiply(noteBaseTop, noteScale)),

        noteBottom.set(
            Add(laneYOffset, Multiply(laneYMultiplier, noteScaleBottom))
        ),
        noteTop.set(Add(laneYOffset, Multiply(laneYMultiplier, noteScaleTop))),
    ]
}
export function drawNote(
    sprite: SkinSprite,
    directional?: { isLeft: boolean; offset: Code<number> }
) {
    const offset = directional
        ? directional.isLeft
            ? Multiply(directional.offset, laneWidth, -1)
            : Multiply(directional.offset, laneWidth)
        : undefined
    const noteBottomLeft = offset
        ? Add(NoteData.bottomLeft, offset)
        : NoteData.bottomLeft
    const noteBottomRight = offset
        ? Add(NoteData.bottomRight, offset)
        : NoteData.bottomRight

    return Draw(
        sprite,
        ...rotate(
            [
                Multiply(noteScaleBottom, noteBottomLeft),
                noteBottom,
                Multiply(noteScaleTop, noteBottomLeft),
                noteTop,
                Multiply(noteScaleTop, noteBottomRight),
                noteTop,
                Multiply(noteScaleBottom, noteBottomRight),
                noteBottom,
            ],
            directional ? (directional.isLeft ? 'left' : 'right') : 'up'
        ),
        directional
            ? Add(NoteData.z, Divide(directional.offset, 100000))
            : NoteData.z,
        1
    )
}

export function drawNoteFlickArrow() {
    const arrowLeft = EntityMemory.to<number>(48)
    const arrowRight = EntityMemory.to<number>(49)

    const arrowBottom = EntityMemory.to<number>(50)
    const arrowTop = EntityMemory.to<number>(51)

    return [
        arrowLeft.set(Multiply(noteScale, NoteData.bottomLeft)),
        arrowRight.set(Multiply(noteScale, NoteData.bottomRight)),

        arrowBottom.set(Add(laneYOffset, Multiply(laneYMultiplier, noteScale))),
        arrowTop.set(Add(arrowBottom, Multiply(noteScale, noteWidth))),

        Draw(
            SkinSprite.DirectionalMarkerRed,
            ...rectByEdge(arrowLeft, arrowRight, arrowBottom, arrowTop),
            Layer.NoteMarker,
            1
        ),
    ]
}

export function drawNoteDirectionalFlickArrow(
    sprite: SkinSprite,
    isLeft: boolean
) {
    const arrowX = EntityMemory.to<number>(48)
    const arrowY = EntityMemory.to<number>(49)
    const arrowWidth = EntityMemory.to<number>(50)

    return [
        arrowX.set(
            Multiply(
                noteScale,
                Add(NoteData.bottomCenter, NoteData.arrowOffset)
            )
        ),
        arrowY.set(Add(laneYOffset, Multiply(laneYMultiplier, noteScale))),
        arrowWidth.set(Multiply(noteScale, halfNoteWidth)),

        Draw(
            sprite,
            ...rectBySize(
                arrowX,
                arrowY,
                arrowWidth,
                arrowWidth,
                isLeft ? 'left' : 'right'
            ),
            Layer.NoteMarker,
            1
        ),
    ]
}
