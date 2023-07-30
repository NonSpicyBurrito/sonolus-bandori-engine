import { flickArrow } from '../../components/flickArrow.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'

export const directionalFlickLeftNoteFall = {
    enter() {
        flickArrow.showFall('left')
        noteDisplay.showFall('directionalFlickLeftNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}
