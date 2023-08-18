import { flickArrow } from '../../components/flickArrow.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'

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
