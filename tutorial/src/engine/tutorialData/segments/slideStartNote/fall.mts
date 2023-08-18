import { connector } from '../../components/connector.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'

export const slideStartNoteFall = {
    enter() {
        noteDisplay.showFall('slideNote')
        connector.showFallIn()
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}
