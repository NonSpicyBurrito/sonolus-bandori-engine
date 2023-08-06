import { lane } from '../../../../../shared/src/engine/data/lane.mjs'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.mjs'
import { scaledScreen } from '../scaledScreen.mjs'
import { layer, skin } from '../skin.mjs'

const sprites = {
    stage: skin.sprites.bandoriStage,
    judgmentLine: skin.sprites.bandoriJudgmentLine,

    fallback: {
        leftBorder: skin.sprites.stageLeftBorder,
        rightBorder: skin.sprites.stageRightBorder,
        lane: skin.sprites.lane,
        laneAlternative: skin.sprites.laneAlternative,
        judgmentLine: skin.sprites.judgmentLine,
        slot: skin.sprites.slot,
    },

    get useFallbackStage() {
        return !this.stage.exists
    },

    get useFallbackJudgmentLine() {
        return !this.judgmentLine.exists
    },
}

export const stage = {
    update() {
        if (sprites.useFallbackStage) {
            this.drawFallbackStage()
        } else {
            this.drawBandoriStage()
        }

        if (sprites.useFallbackJudgmentLine) {
            this.drawFallbackJudgmentLine()
        } else {
            this.drawBandoriJudgmentLine()
        }
    },

    drawBandoriStage() {
        const w = 4.375 * 0.865

        sprites.stage.draw(new Rect({ l: -w, r: w, t: 0.015, b: 1 }), layer.stage, 1)
    },

    drawBandoriJudgmentLine() {
        const w = 4.375 * 1.335
        const h = ((w * 90) / 1800) * scaledScreen.wToH

        sprites.judgmentLine.draw(
            new Rect({ l: -w, r: w, t: 1 - h, b: 1 + h }),
            layer.judgmentLine,
            1,
        )
    },

    drawFallbackStage() {
        sprites.fallback.leftBorder.draw(
            perspectiveLayout({ l: -3.75, r: -3.5, t: lane.t, b: lane.b }),
            layer.stage,
            1,
        )
        sprites.fallback.rightBorder.draw(
            perspectiveLayout({ l: 3.5, r: 3.75, t: lane.t, b: lane.b }),
            layer.stage,
            1,
        )

        for (let i = 0; i < 7; i++) {
            const layout = perspectiveLayout({ l: i - 3.5, r: i - 2.5, t: lane.t, b: lane.b })

            if (i % 2 === 1) {
                sprites.fallback.laneAlternative.draw(layout, layer.stage, 1)
            } else {
                sprites.fallback.lane.draw(layout, layer.stage, 1)
            }
        }
    },

    drawFallbackJudgmentLine() {
        const h = 0.11625 / 4

        sprites.fallback.judgmentLine.draw(
            new Rect({ l: scaledScreen.l, r: scaledScreen.r, t: 1 - h, b: 1 + h }),
            layer.judgmentLine,
            1,
        )

        const sh = h * 0.85
        const sw = sh / scaledScreen.wToH

        for (let i = 0; i < 7; i++) {
            sprites.fallback.slot.draw(
                new Rect({
                    l: i - 3 - sw,
                    r: i - 3 + sw,
                    t: 1 - sh,
                    b: 1 + sh,
                }),
                layer.slot,
                1,
            )
        }
    },
}
