import { options } from '../../../configuration/options.mjs'
import { panel } from '../../panel.mjs'
import { getZ, layer } from '../../skin.mjs'
import { archetypes } from '../index.mjs'

export abstract class SlideConnector extends Archetype {
    data = this.defineData({
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
    })

    abstract sprite: SkinSprite

    render() {
        const t = {
            min: bpmChanges.at(this.headData.beat).time,
            max: bpmChanges.at(this.tailData.beat).time,
        }

        const index = {
            min: Math.floor(t.min / panel.duration),
            max: Math.floor(t.max / panel.duration),
        }

        const lane = {
            min: this.headData.lane,
            max: this.tailData.lane,
        }

        const z = getZ(layer.note.connector, t.min, this.headData.lane)

        for (let i = index.min; i <= index.max; i++) {
            const pt = {
                min: Math.max(t.min, i * panel.duration),
                max: Math.min(t.max, (i + 1) * panel.duration),
            }

            const pl = {
                min: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.min)),
                max: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.max)),
            }

            const y = {
                min: panel.positionFromLocation(i, pt.min - i * panel.duration),
                max: panel.positionFromLocation(i, pt.max - i * panel.duration),
            }

            const layout = new Quad({
                p1: y.min.translate(pl.min - 0.5 * options.noteSize, 0),
                p2: y.max.translate(pl.max - 0.5 * options.noteSize, 0),
                p3: y.max.translate(pl.max + 0.5 * options.noteSize, 0),
                p4: y.min.translate(pl.min + 0.5 * options.noteSize, 0),
            })

            this.sprite.draw(layout, z, options.connectorAlpha)
        }
    }

    get headData() {
        return archetypes.SlideStartNote.data.get(this.data.headRef)
    }

    get tailData() {
        return archetypes.SlideStartNote.data.get(this.data.tailRef)
    }
}
