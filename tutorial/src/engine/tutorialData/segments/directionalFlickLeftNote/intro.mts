import { flickArrow } from '../../components/flickArrow.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'

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
