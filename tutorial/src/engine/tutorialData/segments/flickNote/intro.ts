import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const flickNoteIntro = {
    enter() {
        flickArrow.showOverlay('up')
        noteDisplay.showOverlay('flickNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}
