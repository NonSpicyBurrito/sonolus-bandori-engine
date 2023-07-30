import { noteDisplay } from '../../components/noteDisplay.mjs'

export const tapNoteIntro = {
    enter() {
        noteDisplay.showOverlay('tapNote')
    },

    exit() {
        noteDisplay.clear()
    },
}
