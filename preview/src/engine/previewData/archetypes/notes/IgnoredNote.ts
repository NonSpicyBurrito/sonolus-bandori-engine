import { options } from '../../../configuration/options.js'
import { Note } from './Note.js'

export class IgnoredNote extends Note {
    preprocess() {
        if (options.mirror) this.import.lane *= -1
    }
}
