import { Add, And, Code } from 'sonolus.js'

import { options } from '../../../configuration/options'
import { tilt } from './levelMemory'

export function updateTilt(value: Code<number>) {
    return And(options.isStageTiltEnabled, tilt.set(Add(tilt, value)))
}
