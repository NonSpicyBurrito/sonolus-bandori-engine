import { noteDisplay } from '../../components/noteDisplay.mjs'

export const tapNoteFall = {
    enter() {
        noteDisplay.showFall('tapNote')
    },

    exit() {
        noteDisplay.clear()
    },
}
