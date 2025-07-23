import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const directionalFlickRightNoteIntro = {
    enter() {
        flickArrow.showOverlay('right')
        noteDisplay.showOverlay('directionalFlickRightNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}
