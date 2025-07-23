import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const directionalFlickLeftNoteIntro = {
    enter() {
        flickArrow.showOverlay('left')
        noteDisplay.showOverlay('directionalFlickLeftNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}
