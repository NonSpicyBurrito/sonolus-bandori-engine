import { SingleNote } from '../SingleNote.mjs'

export abstract class SlideNote extends SingleNote {
    slideData = this.defineData({
        firstRef: { name: 'first', type: Number },
        prevRef: { name: 'prev', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        activatedTouchId: TouchId,
    })

    get prevInfo() {
        return entityInfos.get(this.slideData.prevRef)
    }

    get prevData() {
        return this.data.get(this.slideData.prevRef)
    }

    get prevSharedMemory() {
        return this.sharedMemory.get(this.slideData.prevRef)
    }
}
