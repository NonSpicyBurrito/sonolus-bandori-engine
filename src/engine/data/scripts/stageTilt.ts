import {
    Add,
    Divide,
    LevelTransform,
    Multiply,
    ScreenAspectRatio,
    Script,
} from 'sonolus.js'
import { tilt } from './common/levelMemory'

export function stageTilt(): Script {
    const transformTilt = LevelTransform.to<number>(4)

    const updateSequential = [
        transformTilt.set(
            Multiply(
                0.5,
                Add(transformTilt, Divide(tilt, ScreenAspectRatio, -10))
            )
        ),
        tilt.set(0),
    ]

    return {
        updateSequential: {
            code: updateSequential,
        },
    }
}
