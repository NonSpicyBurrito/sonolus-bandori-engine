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
            min: Math.floor(t.min / panel.h),
            max: Math.floor(t.max / panel.h),
        }

        const lane = {
            min: this.headData.lane,
            max: this.tailData.lane,
        }

        const z = getZ(layer.note.connector, t.min, this.headData.lane)

        for (let i = index.min; i <= index.max; i++) {
            const x = i * panel.w

            const pt = {
                min: Math.max(t.min, i * panel.h),
                max: Math.min(t.max, (i + 1) * panel.h),
            }

            const pl = {
                min: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.min)),
                max: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.max)),
            }

            const pos = {
                min: new Vec(x, pt.min - i * panel.h),
                max: new Vec(x, pt.max - i * panel.h),
            }

            const layout = new Quad({
                p1: pos.min.translate(pl.min - 0.5 * options.noteSize, 0),
                p2: pos.max.translate(pl.max - 0.5 * options.noteSize, 0),
                p3: pos.max.translate(pl.max + 0.5 * options.noteSize, 0),
                p4: pos.min.translate(pl.min + 0.5 * options.noteSize, 0),
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
