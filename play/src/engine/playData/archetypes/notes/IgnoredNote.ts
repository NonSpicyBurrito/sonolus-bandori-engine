import { options } from '../../../configuration/options.js'
import { Note } from './Note.js'

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
