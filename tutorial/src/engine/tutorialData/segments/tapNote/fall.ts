import { noteDisplay } from '../../components/noteDisplay.js'

export const tapNoteFall = {
    enter() {
        noteDisplay.showFall('tapNote')
    },

    exit() {
        noteDisplay.clear()
    },
}
