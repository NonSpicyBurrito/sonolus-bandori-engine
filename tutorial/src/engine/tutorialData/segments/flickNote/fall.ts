import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const flickNoteFall = {
    enter() {
        flickArrow.showFall('up')
        noteDisplay.showFall('flickNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}
