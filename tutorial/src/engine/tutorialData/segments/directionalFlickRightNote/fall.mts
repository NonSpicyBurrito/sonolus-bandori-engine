import { flickArrow } from '../../components/flickArrow.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'

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
