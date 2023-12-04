import { EngineArchetypeDataName } from 'sonolus-core'
import { options } from '../../../configuration/options.mjs'

export abstract class Note extends Archetype {
    data = this.defineData({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
    })

    preprocess() {
        if (options.mirror) this.data.lane *= -1
    }
}
