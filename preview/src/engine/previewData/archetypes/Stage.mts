import { chart } from '../chart.mjs'
import { panel } from '../panel.mjs'
import { print } from '../print.mjs'
import { layer, line, skin } from '../skin.mjs'

export class Stage extends Archetype {
    preprocessOrder = 1
    preprocess() {
        canvas.set({
            scroll: Scroll.LeftToRight,
            size: (panel.count * screen.h * 11) / 20,
        })
    }

    render() {
        this.renderPanels()

        this.renderBeats()

        this.printTimes()
        this.printMeasures()
    }

    renderPanels() {
        for (let i = 0; i < panel.count; i++) {
            skin.sprites.stageLeftBorder.draw(
                new Rect({
                    l: i * 11 - 3.75,
                    r: i * 11 - 3.5,
                    b: 0,
                    t: 1,
                }),
                layer.stage,
                1,
            )
            skin.sprites.stageRightBorder.draw(
                new Rect({
                    l: i * 11 + 3.5,
                    r: i * 11 + 3.75,
                    b: 0,
                    t: 1,
                }),
                layer.stage,
                1,
            )

            for (let j = 0; j < 7; j++) {
                const layout = new Rect({
                    l: i * 11 + (j - 3.5),
                    r: i * 11 + (j - 2.5),
                    b: 0,
                    t: 1,
                })

                if (j % 2 === 1) {
                    skin.sprites.laneAlternative.draw(layout, layer.stage, 1)
                } else {
                    skin.sprites.lane.draw(layout, layer.stage, 1)
                }
            }
        }
    }

    renderBeats() {
        for (let i = 0; i <= Math.floor(chart.beats); i++) {
            line(skin.sprites.beatLine, i, i % 4 === 0 ? 0.25 : 0.125)
        }
    }

    printTimes() {
        for (let i = 1; i <= Math.floor(chart.duration); i++) {
            print(i, i, PrintFormat.Time, 0, PrintColor.Neutral, 'left')
        }
    }

    printMeasures() {
        for (let i = 4; i <= Math.floor(chart.beats); i += 4) {
            print(
                i / 4 + 1,
                bpmChanges.at(i).time,
                PrintFormat.MeasureCount,
                0,
                PrintColor.Neutral,
                'right',
            )
        }
    }
}
