import { ParticleEffect } from 'sonolus-core'
import {
    Add,
    And,
    Code,
    DestroyParticleEffect,
    MoveParticleEffect,
    Multiply,
    SpawnParticleEffect,
    Subtract,
} from 'sonolus.js'
import { options } from '../../../configuration/options'
import {
    halfCircularHoldEffectHeight,
    halfCircularHoldEffectWidth,
    halfCircularTapEffectHeight,
    halfCircularTapEffectWidth,
    halfLinearHoldEffectSize,
    halfLinearTapEffectSize,
    halfSlotEffectSize,
    laneBottom,
    laneTop,
} from './constants'
import { NoteSharedMemoryPointer } from './note'
import {
    getLaneBottomCenter,
    getLaneBottomLeft,
    getLaneBottomRight,
    getLaneTopLeft,
    getLaneTopRight,
} from './stage'
import { rectByEdge, rectBySize } from './utils'

export function playSlotEffect(lane: Code<number>) {
    return And(
        options.isSlotEffectEnabled,
        SpawnParticleEffect(
            ParticleEffect.SlotLinear,
            ...rectByEdge(
                Subtract(getLaneBottomCenter(lane), halfSlotEffectSize),
                Add(getLaneBottomCenter(lane), halfSlotEffectSize),
                laneBottom,
                Add(laneBottom, Multiply(halfSlotEffectSize, 2))
            ),
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
    linear: Code<number>,
    circular: Code<number>,
    direction: 'left' | 'up' | 'right'
) {
    return And(options.isNoteEffectEnabled, [
        {
            left: playLinearNoteEffectLeft,
            up: playLinearNoteEffectUp,
            right: playLinearNoteEffectRight,
        }[direction](center, linear),

        SpawnParticleEffect(
            circular,
            ...rectBySize(
                center,
                laneBottom,
                halfCircularTapEffectWidth,
                halfCircularTapEffectHeight
            ),
            0.6,
            false
        ),
    ])
}
function playLinearNoteEffectUp(center: Code<number>, linear: Code<number>) {
    return SpawnParticleEffect(
        linear,
        ...rectByEdge(
            Subtract(center, halfLinearTapEffectSize),
            Add(center, halfLinearTapEffectSize),
            laneBottom,
            Add(laneBottom, Multiply(2, halfLinearTapEffectSize))
        ),
        0.4,
        false
    )
}
function playLinearNoteEffectLeft(center: Code<number>, linear: Code<number>) {
    return SpawnParticleEffect(
        linear,
        ...rectByEdge(
            Subtract(center, Multiply(2, halfLinearTapEffectSize)),
            center,
            Subtract(laneBottom, halfLinearTapEffectSize),
            Add(laneBottom, halfLinearTapEffectSize),
            'left'
        ),
        0.4,
        false
    )
}
function playLinearNoteEffectRight(center: Code<number>, linear: Code<number>) {
    return SpawnParticleEffect(
        linear,
        ...rectByEdge(
            center,
            Add(center, Multiply(2, halfLinearTapEffectSize)),
            Subtract(laneBottom, halfLinearTapEffectSize),
            Add(laneBottom, halfLinearTapEffectSize),
            'right'
        ),
        0.4,
        false
    )
}

export function spawnHoldEffect(
    noteSharedMemory: NoteSharedMemoryPointer,
    center: Code<number>
) {
    return And(options.isNoteEffectEnabled, [
        noteSharedMemory.linearHoldEffectId.set(
            SpawnParticleEffect(
                ParticleEffect.NoteLinearHoldGreen,
                ...rectByEdge(
                    Subtract(center, halfLinearHoldEffectSize),
                    Add(center, halfLinearHoldEffectSize),
                    laneBottom,
                    Add(laneBottom, Multiply(2, halfLinearHoldEffectSize))
                ),
                1,
                true
            )
        ),

        noteSharedMemory.circularHoldEffectId.set(
            SpawnParticleEffect(
                ParticleEffect.NoteCircularHoldGreen,
                ...rectBySize(
                    center,
                    laneBottom,
                    halfCircularHoldEffectWidth,
                    halfCircularHoldEffectHeight
                ),
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
    return [
        MoveParticleEffect(
            noteSharedMemory.linearHoldEffectId,
            ...rectByEdge(
                Subtract(center, halfLinearHoldEffectSize),
                Add(center, halfLinearHoldEffectSize),
                laneBottom,
                Add(laneBottom, Multiply(2, halfLinearHoldEffectSize))
            )
        ),

        MoveParticleEffect(
            noteSharedMemory.circularHoldEffectId,
            ...rectBySize(
                center,
                laneBottom,
                halfCircularHoldEffectWidth,
                halfCircularHoldEffectHeight
            )
        ),
    ]
}

export function destroyHoldEffect(noteSharedMemory: NoteSharedMemoryPointer) {
    return And(options.isNoteEffectEnabled, [
        DestroyParticleEffect(noteSharedMemory.linearHoldEffectId),
        DestroyParticleEffect(noteSharedMemory.circularHoldEffectId),
    ])
}
