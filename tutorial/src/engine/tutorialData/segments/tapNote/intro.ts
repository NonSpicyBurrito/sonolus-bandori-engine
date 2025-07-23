import { noteDisplay } from '../../components/noteDisplay.js'

export const tapNoteIntro = {
    enter() {
        noteDisplay.showOverlay('tapNote')
    },

    exit() {
        noteDisplay.clear()
    },
}
