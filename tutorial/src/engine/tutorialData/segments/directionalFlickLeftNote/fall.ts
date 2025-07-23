import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const directionalFlickLeftNoteFall = {
    enter() {
        flickArrow.showFall('left')
        noteDisplay.showFall('directionalFlickLeftNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}
