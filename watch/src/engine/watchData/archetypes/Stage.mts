import { lane } from '../../../../../shared/src/engine/data/lane.mjs'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.mjs'
import { options } from '../../configuration/options.mjs'
import { scaledScreen } from '../scaledScreen.mjs'
import { layer, skin } from '../skin.mjs'

export class Stage extends Archetype {
    spawnTime() {
        return -999999
    }

    despawnTime() {
        return 999999
    }

    updateParallel() {
        if (this.useFallbackStage) {
            this.drawFallbackStage()
        } else {
            this.drawBandoriStage()
        }

        if (this.useFallbackJudgmentLine) {
            this.drawFallbackJudgmentLine()
        } else {
            this.drawBandoriJudgmentLine()
        }

        this.drawStageCover()
    }

    get useFallbackStage() {
        return !skin.sprites.bandoriStage.exists
    }

    get useFallbackJudgmentLine() {
        return !skin.sprites.bandoriJudgmentLine.exists
    }

    drawBandoriStage() {
        const w = 4.375 * 0.865

        skin.sprites.bandoriStage.draw(new Rect({ l: -w, r: w, t: 0.015, b: 1 }), layer.stage, 1)
    }

    drawBandoriJudgmentLine() {
        const w = 4.375 * 1.335
        const h = ((w * 90) / 1800) * scaledScreen.wToH

        skin.sprites.bandoriJudgmentLine.draw(
            new Rect({ l: -w, r: w, t: 1 - h, b: 1 + h }),
            layer.judgmentLine,
            1,
        )
    }

    drawFallbackStage() {
        skin.sprites.stageLeftBorder.draw(
            perspectiveLayout({ l: -3.75, r: -3.5, t: lane.t, b: lane.b }),
            layer.stage,
            1,
        )
        skin.sprites.stageRightBorder.draw(
            perspectiveLayout({ l: 3.5, r: 3.75, t: lane.t, b: lane.b }),
            layer.stage,
            1,
        )

        for (let i = 0; i < 7; i++) {
            const layout = perspectiveLayout({ l: i - 3.5, r: i - 2.5, t: lane.t, b: lane.b })

            if (i % 2 === 1) {
                skin.sprites.laneAlternative.draw(layout, layer.stage, 1)
            } else {
                skin.sprites.lane.draw(layout, layer.stage, 1)
            }
        }
    }

    drawFallbackJudgmentLine() {
        const h = 0.11625 / 4

        skin.sprites.judgmentLine.draw(
            new Rect({ l: scaledScreen.l, r: scaledScreen.r, t: 1 - h, b: 1 + h }),
            layer.judgmentLine,
            1,
        )

        const sh = h * 0.85
        const sw = sh / scaledScreen.wToH

        for (let i = 0; i < 7; i++) {
            skin.sprites.slot.draw(
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
    }

    drawStageCover() {
        if (options.stageCover <= 0) return

        skin.sprites.cover.draw(
            new Rect({
                l: scaledScreen.l,
                r: scaledScreen.r,
                t: scaledScreen.t,
                b: Math.lerp(lane.t, 1, options.stageCover),
            }),
            layer.cover,
            1,
        )
    }
}
