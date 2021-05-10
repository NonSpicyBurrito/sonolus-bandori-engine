import {
    Add,
    And,
    Code,
    DestroyParticleEffect,
    MoveParticleEffect,
    Multiply,
    Not,
    Or,
    ParticleEffect,
    SpawnParticleEffect,
    Subtract,
} from 'sonolus.js'

import { options } from '../../../configuration/options'
import {
    circularHoldEffectBottom,
    circularHoldEffectTop,
    halfCircularHoldEffectWidth,
    halfCircularTapEffectHeight,
    halfCircularTapEffectWidth,
    halfLinearHoldEffectWidth,
    halfLinearTapEffectWidth,
    halfSlotEffectWidth,
    laneBottom,
    laneTop,
    linearHoldEffectBottom,
    linearHoldEffectTop,
} from './constants'
import { NoteSharedMemoryPointer } from './note'
import {
    getLaneBottomCenter,
    getLaneBottomLeft,
    getLaneBottomRight,
    getLaneTopLeft,
    getLaneTopRight,
} from './stage'

export function playSlotEffect(lane: Code<number>) {
    const slotEffectLeft = Subtract(
        getLaneBottomCenter(lane),
        halfSlotEffectWidth
    )
    const slotEffectRight = Add(getLaneBottomCenter(lane), halfSlotEffectWidth)
    const slotEffectTop = Add(laneBottom, Multiply(halfSlotEffectWidth, 2))

    return And(
        options.isSlotEffectEnabled,
        SpawnParticleEffect(
            ParticleEffect.SlotLinear,
            slotEffectLeft,
            laneBottom,
            slotEffectLeft,
            slotEffectTop,
            slotEffectRight,
            slotEffectTop,
            slotEffectRight,
            laneBottom,
            0.6,
            false
        )
    )
}

export function playLaneEffect(lane: Code<number>) {
    return And(
        options.isLaneEffectEnabled,
        SpawnParticleEffect(
            ParticleEffect.LaneLinear,
            getLaneBottomLeft(lane),
            laneBottom,
            getLaneTopLeft(lane),
            laneTop,
            getLaneTopRight(lane),
            laneTop,
            getLaneBottomRight(lane),
            laneBottom,
            0.2,
            false
        )
    )
}

export function playNoteEffect(
    center: Code<number>,
    linear: ParticleEffect,
    circular: ParticleEffect,
    direction: -1 | 0 | 1
) {
    const circularTapEffectLeft = Subtract(center, halfCircularTapEffectWidth)
    const circularTapEffectRight = Add(center, halfCircularTapEffectWidth)
    const circularTapEffectBottom = Add(laneBottom, halfCircularTapEffectHeight)
    const circularTapEffectTop = Subtract(
        laneBottom,
        halfCircularTapEffectHeight
    )

    return And(options.isNoteEffectEnabled, [
        {
            [-1]: playLinearNoteEffectLeft,
            [0]: playLinearNoteEffectUp,
            [1]: playLinearNoteEffectRight,
        }[direction](center, linear),
        SpawnParticleEffect(
            circular,
            circularTapEffectLeft,
            circularTapEffectBottom,
            circularTapEffectLeft,
            circularTapEffectTop,
            circularTapEffectRight,
            circularTapEffectTop,
            circularTapEffectRight,
            circularTapEffectBottom,
            0.6,
            false
        ),
    ])
}
function playLinearNoteEffectUp(center: Code<number>, linear: ParticleEffect) {
    const linearTapEffectLeft = Subtract(center, halfLinearTapEffectWidth)
    const linearTapEffectRight = Add(center, halfLinearTapEffectWidth)
    const linearTapEffectBottom = laneBottom
    const linearTapEffectTop = Add(
        laneBottom,
        Multiply(2, halfLinearTapEffectWidth)
    )

    return SpawnParticleEffect(
        linear,
        linearTapEffectLeft,
        linearTapEffectBottom,
        linearTapEffectLeft,
        linearTapEffectTop,
        linearTapEffectRight,
        linearTapEffectTop,
        linearTapEffectRight,
        linearTapEffectBottom,
        0.4,
        false
    )
}
function playLinearNoteEffectLeft(
    center: Code<number>,
    linear: ParticleEffect
) {
    const linearTapEffectLeft = Subtract(laneBottom, halfLinearTapEffectWidth)
    const linearTapEffectRight = Add(laneBottom, halfLinearTapEffectWidth)
    const linearTapEffectBottom = center
    const linearTapEffectTop = Subtract(
        center,
        Multiply(2, halfLinearTapEffectWidth)
    )

    return SpawnParticleEffect(
        linear,
        linearTapEffectBottom,
        linearTapEffectLeft,
        linearTapEffectTop,
        linearTapEffectLeft,
        linearTapEffectTop,
        linearTapEffectRight,
        linearTapEffectBottom,
        linearTapEffectRight,
        0.4,
        false
    )
}
function playLinearNoteEffectRight(
    center: Code<number>,
    linear: ParticleEffect
) {
    const linearTapEffectLeft = Add(laneBottom, halfLinearTapEffectWidth)
    const linearTapEffectRight = Subtract(laneBottom, halfLinearTapEffectWidth)
    const linearTapEffectBottom = center
    const linearTapEffectTop = Add(
        center,
        Multiply(2, halfLinearTapEffectWidth)
    )

    return SpawnParticleEffect(
        linear,
        linearTapEffectBottom,
        linearTapEffectLeft,
        linearTapEffectTop,
        linearTapEffectLeft,
        linearTapEffectTop,
        linearTapEffectRight,
        linearTapEffectBottom,
        linearTapEffectRight,
        0.4,
        false
    )
}

export function spawnHoldEffect(
    noteSharedMemory: NoteSharedMemoryPointer,
    center: Code<number>
) {
    const linearHoldEffectLeft = Subtract(center, halfLinearHoldEffectWidth)
    const linearHoldEffectRight = Add(center, halfLinearHoldEffectWidth)

    const circularHoldEffectLeft = Subtract(center, halfCircularHoldEffectWidth)
    const circularHoldEffectRight = Add(center, halfCircularHoldEffectWidth)

    return And(options.isNoteEffectEnabled, [
        noteSharedMemory.linearHoldEffectId.set(
            SpawnParticleEffect(
                ParticleEffect.NoteLinearHoldGreen,
                linearHoldEffectLeft,
                linearHoldEffectBottom,
                linearHoldEffectLeft,
                linearHoldEffectTop,
                linearHoldEffectRight,
                linearHoldEffectTop,
                linearHoldEffectRight,
                linearHoldEffectBottom,
                1,
                true
            )
        ),

        noteSharedMemory.circularHoldEffectId.set(
            SpawnParticleEffect(
                ParticleEffect.NoteCircularHoldGreen,
                circularHoldEffectLeft,
                circularHoldEffectBottom,
                circularHoldEffectLeft,
                circularHoldEffectTop,
                circularHoldEffectRight,
                circularHoldEffectTop,
                circularHoldEffectRight,
                circularHoldEffectBottom,
                1,
                true
            )
        ),
    ])
}

export function moveHoldEffect(
    noteSharedMemory: NoteSharedMemoryPointer,
    center: Code<number>
) {
    const linearHoldEffectLeft = Subtract(center, halfLinearHoldEffectWidth)
    const linearHoldEffectRight = Add(center, halfLinearHoldEffectWidth)

    const circularHoldEffectLeft = Subtract(center, halfCircularHoldEffectWidth)
    const circularHoldEffectRight = Add(center, halfCircularHoldEffectWidth)

    return [
        MoveParticleEffect(
            noteSharedMemory.linearHoldEffectId,
            linearHoldEffectLeft,
            linearHoldEffectBottom,
            linearHoldEffectLeft,
            linearHoldEffectTop,
            linearHoldEffectRight,
            linearHoldEffectTop,
            linearHoldEffectRight,
            linearHoldEffectBottom
        ),
        MoveParticleEffect(
            noteSharedMemory.circularHoldEffectId,
            circularHoldEffectLeft,
            circularHoldEffectBottom,
            circularHoldEffectLeft,
            circularHoldEffectTop,
            circularHoldEffectRight,
            circularHoldEffectTop,
            circularHoldEffectRight,
            circularHoldEffectBottom
        ),
    ]
}

export function destroyHoldEffect(noteSharedMemory: NoteSharedMemoryPointer) {
    return Or(Not(options.isNoteEffectEnabled), [
        DestroyParticleEffect(noteSharedMemory.linearHoldEffectId),
        DestroyParticleEffect(noteSharedMemory.circularHoldEffectId),
        true,
    ])
}
