import { SingleNote } from '../SingleNote.mjs'

export abstract class SlideNote extends SingleNote {
    slideImport = this.defineImport({
        firstRef: { name: 'first', type: Number },
        prevRef: { name: 'prev', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        activatedTouchId: TouchId,
    })

    get prevInfo() {
        return entityInfos.get(this.slideImport.prevRef)
    }

    get prevImport() {
        return this.import.get(this.slideImport.prevRef)
    }

    get prevSharedMemory() {
        return this.sharedMemory.get(this.slideImport.prevRef)
    }
}
