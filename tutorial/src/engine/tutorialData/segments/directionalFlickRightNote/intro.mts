import { flickArrow } from '../../components/flickArrow.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'

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
