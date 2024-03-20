import { options } from '../../../configuration/options.mjs'
import { Note } from './Note.mjs'

export class IgnoredNote extends Note {
    hasInput = false

    preprocess() {
        if (options.mirror) this.import.lane *= -1
    }

    spawnOrder() {
        return 100000
    }

    shouldSpawn() {
        return false
    }
}
