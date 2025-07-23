import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const directionalFlickRightNoteFall = {
    enter() {
        flickArrow.showFall('right')
        noteDisplay.showFall('directionalFlickRightNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}
