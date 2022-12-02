import { ParticleEffect, SkinSprite } from 'sonolus-core'
import {
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
    GreaterOr,
    If,
    InputAccuracy,
    InputBucket,
    InputJudgment,
    InputOffset,
    Lerp,
    LessOr,
    Min,
    Mod,
    Multiply,
    Not,
    Or,
    Pointer,
    Power,
    Spawn,
    State,
    Subtract,
    Time,
    TouchEnded,
    TouchId,
} from 'sonolus.js'
import { scripts } from '..'
import { options } from '../../../configuration/options'
import { archetypes } from '../../archetypes'
import {
    circularLeftDirectionalFlickEffect,
    circularRightDirectionalFlickEffect,
    goodWindow,
    halfNoteWidth,
    laneWidth,
    Layer,
    linearLeftDirectionalFlickEffect,
    linearRightDirectionalFlickEffect,
    noteBaseBottom,
    noteBaseBottomScale,
    noteBaseTop,
    noteBaseTopScale,
    noteOnScreenDuration,
    noteWidth,
    stageBottom,
    stageTop,
} from './constants'
import {
    destroyHoldEffect,
    playLaneEffect,
    playNoteEffect,
    spawnHoldEffect,
} from './effect'
import { playHoldSFX, stopHoldSFX } from './sfx'
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

    public get isLong() {
        return this.to<boolean>(5)
    }

    public get visibleTime() {
        return this.to<number>(16)
    }

    public get spawnTime() {
        return this.to<number>(17)
    }

    public get center() {
        return this.to<number>(18)
    }

    public get left() {
        return this.to<number>(19)
    }

    public get right() {
        return this.to<number>(20)
    }

    public get z() {
        return this.to<number>(21)
    }

    public get markerZ() {
        return this.to<number>(22)
    }

    public get arrowOffset() {
        return this.to<number>(23)
    }

    public get hitboxLeft() {
        return this.to<number>(24)
    }

    public get hitboxRight() {
        return this.to<number>(25)
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

    public get holdSFXClipId() {
        return this.to<number>(5)
    }
}

export const NoteSharedMemory = createEntitySharedMemory(
    NoteSharedMemoryPointer
)

// Memory

export const noteScale = EntityMemory.to<number>(32)
export const noteInputState = EntityMemory.to<InputState>(33)

export const noteBottom = EntityMemory.to<number>(48)
export const noteTop = EntityMemory.to<number>(49)

// SFX

export function playNoteHoldSFX() {
    return playHoldSFX(NoteSharedMemory)
}

export function stopNoteHoldSFX() {
    return stopHoldSFX(NoteSharedMemory)
}

// Effect

export function playNoteLaneEffect() {
    return playLaneEffect(NoteData.lane)
}

export function playNoteTapEffect() {
    return playNoteEffect(
        NoteData.center,
        ParticleEffect.NoteLinearTapCyan,
        ParticleEffect.NoteCircularTapCyan,
        'up'
    )
}
export function playNoteFlickEffect() {
    return playNoteEffect(
        NoteData.center,
        ParticleEffect.NoteLinearAlternativeRed,
        ParticleEffect.NoteCircularAlternativeRed,
        'up'
    )
}
export function playNoteLeftDirectionalFlickEffect() {
    return playNoteEffect(
        NoteData.center,
        linearLeftDirectionalFlickEffect,
        circularLeftDirectionalFlickEffect,
        'left'
    )
}
export function playNoteRightDirectionalFlickEffect() {
    return playNoteEffect(
        NoteData.center,
        linearRightDirectionalFlickEffect,
        circularRightDirectionalFlickEffect,
        'right'
    )
}

export function spawnNoteHoldEffect(index?: Code<number>) {
    return spawnHoldEffect(
        index ? NoteSharedMemory.of(index) : NoteSharedMemory,
        (index ? NoteData.of(index) : NoteData).head.center
    )
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
        Subtract(NoteData.time, Subtract(Time, InputOffset)),
        goodWindow
    )
}

// Note

export function approach(time: Code<number>) {
    return Add(
        0.05,
        Multiply(
            0.95,
            Power(1.1 ** 50, Divide(Subtract(Time, time), noteOnScreenDuration))
        )
    )
}

export function getVisibleTime(time: Code<number>) {
    return Subtract(time, noteOnScreenDuration)
}

export function getZ(
    layer: number,
    time: Code<number> = NoteData.time,
    index: Code<number> = EntityInfo.index
) {
    return Subtract(
        layer,
        Divide(Mod(time, 10), 10),
        Divide(Mod(index, 100), 100000)
    )
}

export function isNotHidden(time: Code<number> = NoteData.time) {
    return Or(
        LessOr(options.hidden, 0),
        GreaterOr(
            Divide(Subtract(time, Time), noteOnScreenDuration),
            options.hidden
        )
    )
}

export function preprocessNote(isSlide: boolean, missAccuracy: Code<number>) {
    return [
        NoteData.time.set(Divide(NoteData.time, options.speed)),
        And(options.isMirrorEnabled, [
            NoteData.lane.set(Multiply(NoteData.lane, -1)),
            NoteData.isLeft.set(Not(NoteData.isLeft)),
        ]),

        NoteData.visibleTime.set(getVisibleTime(NoteData.time)),
        NoteData.spawnTime.set(
            Min(
                Subtract(NoteData.time, 0.5),
                isSlide
                    ? Min(NoteData.visibleTime, NoteData.head.visibleTime)
                    : NoteData.visibleTime
            )
        ),

        NoteData.center.set(getLaneBottomCenter(NoteData.lane)),
        NoteData.left.set(Subtract(NoteData.center, halfNoteWidth)),
        NoteData.right.set(Add(NoteData.center, halfNoteWidth)),

        NoteData.hitboxLeft.set(
            Subtract(
                NoteData.center,
                Multiply(
                    laneWidth,
                    If(NoteData.isLeft, Add(1.175, NoteData.extraWidth), 1.175)
                )
            )
        ),
        NoteData.hitboxRight.set(
            Add(
                NoteData.center,
                Multiply(
                    laneWidth,
                    If(NoteData.isLeft, 1.175, Add(1.175, NoteData.extraWidth))
                )
            )
        ),

        NoteData.z.set(getZ(Layer.NoteBody)),
        NoteData.markerZ.set(getZ(Layer.NoteMarker)),

        Or(options.isAutoplay, InputAccuracy.set(missAccuracy)),
    ]
}

export function preprocessArrowOffset() {
    const offset = Add(Multiply(laneWidth, NoteData.extraWidth), noteWidth)

    return NoteData.arrowOffset.set(
        If(NoteData.isLeft, Multiply(-1, offset), offset)
    )
}

export function initializeNote(
    bucket: Code<number>,
    autoNoteIndex: Code<number>,
    isSlide: boolean,
    canHaveSimLine: boolean
) {
    const leftIndex = Subtract(EntityInfo.index, 1)
    const leftArchetype = EntityInfo.of(leftIndex).archetype

    return [
        And(options.isAutoplay, [
            InputJudgment.set(1),
            InputBucket.set(bucket),
        ]),

        And(
            Or(
                And(
                    options.isSFXEnabled,
                    Or(options.isAutoplay, options.isAutoSFX)
                ),
                And(options.isAutoplay, isSlide),
                And(options.isAutoplay, options.isLaneEffectEnabled),
                And(options.isAutoplay, options.isNoteEffectEnabled)
            ),
            Spawn(autoNoteIndex, [EntityInfo.index])
        ),

        And(
            canHaveSimLine,
            options.isSimLineEnabled,
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
        ),
    ]
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
                    playNoteHoldSFX(),
                ]
            ),
            And(
                Equal(noteHeadInfo.state, State.Despawned),
                GreaterOr(Subtract(Time, InputOffset), NoteData.head.time),
                Not(isTouchOccupied),
                checkTouchYInHitbox(),
                checkTouchXInNoteHitbox(NoteData.head),
                [
                    isTouchOccupied.set(true),
                    noteInputState.set(InputState.Activated),

                    NoteSharedMemory.inputTouchId.set(TouchId),
                    NoteSharedMemory.isSliding.set(true),

                    spawnNoteHoldEffect(),
                    playNoteHoldSFX(),
                ]
            )
        )
    )
}

export function touchProcessDiscontinue() {
    return And(TouchEnded, noteInputState.set(InputState.Terminated))
}

export function updateNoteScale() {
    return noteScale.set(approach(NoteData.time))
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
        noteBottom.set(Lerp(stageTop, noteBaseBottom, noteScale)),
        noteTop.set(Lerp(stageTop, noteBaseTop, noteScale)),
    ]
}
export function drawNote(
    sprite: Code<number>,
    directional?: { isLeft: boolean; offset: Code<number> }
) {
    const offset = directional
        ? directional.isLeft
            ? Multiply(directional.offset, laneWidth, -1)
            : Multiply(directional.offset, laneWidth)
        : undefined
    const noteLeft = offset ? Add(NoteData.left, offset) : NoteData.left
    const noteRight = offset ? Add(NoteData.right, offset) : NoteData.right

    return Draw(
        sprite,
        ...rotate(
            [
                Multiply(noteLeft, noteBaseBottomScale, noteScale),
                noteBottom,
                Multiply(noteLeft, noteBaseTopScale, noteScale),
                noteTop,
                Multiply(noteRight, noteBaseTopScale, noteScale),
                noteTop,
                Multiply(noteRight, noteBaseBottomScale, noteScale),
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
        arrowLeft.set(Multiply(noteScale, NoteData.left)),
        arrowRight.set(Multiply(noteScale, NoteData.right)),

        arrowBottom.set(Lerp(stageTop, stageBottom, noteScale)),
        arrowTop.set(Add(arrowBottom, Multiply(noteScale, noteWidth))),

        Draw(
            SkinSprite.DirectionalMarkerRed,
            ...rectByEdge(arrowLeft, arrowRight, arrowBottom, arrowTop),
            NoteData.markerZ,
            1
        ),
    ]
}

export function drawNoteDirectionalFlickArrow(
    sprite: Code<number>,
    isLeft: boolean
) {
    const arrowX = EntityMemory.to<number>(48)
    const arrowY = EntityMemory.to<number>(49)
    const arrowWidth = EntityMemory.to<number>(50)

    return [
        arrowX.set(
            Multiply(noteScale, Add(NoteData.center, NoteData.arrowOffset))
        ),
        arrowY.set(Lerp(stageTop, stageBottom, noteScale)),
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
            NoteData.markerZ,
            1
        ),
    ]
}
