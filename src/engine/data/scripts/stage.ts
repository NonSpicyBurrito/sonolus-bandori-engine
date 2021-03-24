import {
    Add,
    And,
    bool,
    Divide,
    Draw,
    EntityInfo,
    EntityMemory,
    Equal,
    GreaterOr,
    Lerp,
    LessOr,
    Multiply,
    Not,
    Or,
    Round,
    SkinSprite,
    Spawn,
    SScript,
    State,
    Subtract,
    TouchStarted,
    TouchX,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import { scripts } from '.'
import {
    halfBaseNoteHeight,
    laneBottom,
    laneTop,
    laneWidth,
    layerCover,
    layerJudgmentLine,
    layerSlot,
    layerStage,
    screenLeft,
    screenRight,
} from './common/constants'
import { playLaneEffect, playSlotEffect } from './common/effect'
import { playStageSFX } from './common/sfx'
import {
    getLaneBottomCenter,
    getLaneBottomLeft,
    getLaneBottomRight,
    getLaneTopLeft,
    getLaneTopRight,
} from './common/stage'
import { checkTouchYInHitBox, isTouchOccupied } from './common/touch'

export function stage(): SScript {
    const spawnOrder = -999

    const shouldSpawn = Equal(EntityInfo.of(0).state, State.Despawned)

    const initialize = And(
        options.isStageTiltEnabled,
        Spawn(scripts.stageTiltIndex, [])
    )

    const touch = Or(
        options.isAutoplay,
        And(
            TouchStarted,
            checkTouchYInHitBox(),
            Not(isTouchOccupied),
            GreaterOr(TouchX, getLaneBottomLeft(-3)),
            LessOr(TouchX, getLaneBottomRight(3)),
            onEmptyTap()
        )
    )

    const updateParallel = [drawStageCover(), drawStage()]

    return {
        spawnOrder: {
            code: spawnOrder,
        },
        shouldSpawn: {
            code: shouldSpawn,
        },
        initialize: {
            code: initialize,
        },
        touch: {
            code: touch,
            order: 1,
        },
        updateParallel: {
            code: updateParallel,
        },
    }

    function drawStageCover() {
        const stageCoverBottom = Lerp(laneTop, laneBottom, options.stageCover)

        return And(
            bool(options.stageCover),
            Draw(
                SkinSprite.StageCover,
                screenLeft,
                stageCoverBottom,
                screenLeft,
                1,
                screenRight,
                1,
                screenRight,
                stageCoverBottom,
                layerCover,
                1
            )
        )
    }

    function drawStage() {
        const halfJudgmentLineHeight = Divide(halfBaseNoteHeight, 2)
        const judgmentLineTop = Subtract(laneBottom, halfJudgmentLineHeight)
        const judgmentLineBottom = Add(laneBottom, halfJudgmentLineHeight)

        const borderWidth = 0.25
        const borderTopLeft = getLaneTopLeft(-3 - borderWidth)
        const borderTopRight = getLaneTopRight(3 + borderWidth)
        const borderBottomLeft = getLaneBottomLeft(-3 - borderWidth)
        const borderBottomRight = getLaneBottomRight(3 + borderWidth)

        const halfSlotSize = Multiply(halfJudgmentLineHeight, 0.85)
        const slotBottom = Subtract(laneBottom, halfSlotSize)
        const slotTop = Add(laneBottom, halfSlotSize)

        const code = [
            Draw(
                SkinSprite.JudgmentLine,
                screenLeft,
                judgmentLineBottom,
                screenLeft,
                judgmentLineTop,
                screenRight,
                judgmentLineTop,
                screenRight,
                judgmentLineBottom,
                layerJudgmentLine,
                1
            ),

            Draw(
                SkinSprite.StageLeftBorder,
                borderBottomLeft,
                laneBottom,
                borderTopLeft,
                laneTop,
                getLaneTopLeft(-3),
                laneTop,
                getLaneBottomLeft(-3),
                laneBottom,
                layerStage,
                1
            ),
            Draw(
                SkinSprite.StageRightBorder,
                getLaneBottomRight(3),
                laneBottom,
                getLaneTopRight(3),
                laneTop,
                borderTopRight,
                laneTop,
                borderBottomRight,
                laneBottom,
                layerStage,
                1
            ),
        ]

        for (let i = 0; i < 7; i++) {
            code.push(
                Draw(
                    SkinSprite.Lane,
                    getLaneBottomLeft(i - 3),
                    laneBottom,
                    getLaneTopLeft(i - 3),
                    laneTop,
                    getLaneTopRight(i - 3),
                    laneTop,
                    getLaneBottomRight(i - 3),
                    laneBottom,
                    layerStage,
                    1
                )
            )

            const slotLeft = Subtract(getLaneBottomCenter(i - 3), halfSlotSize)
            const slotRight = Add(getLaneBottomCenter(i - 3), halfSlotSize)

            code.push(
                Draw(
                    SkinSprite.NoteSlot,
                    slotLeft,
                    slotBottom,
                    slotLeft,
                    slotTop,
                    slotRight,
                    slotTop,
                    slotRight,
                    slotBottom,
                    layerSlot,
                    1
                )
            )
        }

        return code
    }

    function onEmptyTap() {
        const lane = EntityMemory.to<number>(0)

        return [
            playStageSFX(),

            lane.set(Round(Divide(TouchX, laneWidth))),
            playLaneEffect(lane),
            playSlotEffect(lane),
        ]
    }
}
