import { effect } from '../../../../../effect.mjs'
import { particle } from '../../../../../particle.mjs'
import { SlideConnector } from '../../../../sliderConnectors/SlideConnector.mjs'
import { SingleNote } from '../SingleNote.mjs'

export abstract class SlideNote extends SingleNote {
    slideData = this.defineData({
        prevRef: { name: 'prev', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        activatedTouchId: TouchId,
        clipInstanceId: LoopedEffectClipInstanceId,
        effectInstanceIds: {
            circular: ParticleEffectInstanceId,
            linear: ParticleEffectInstanceId,
        },
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

    startSlideEffects() {
        if (SlideConnector.shouldPlaySFX)
            this.sharedMemory.clipInstanceId = SlideConnector.playSFX()

        if (SlideConnector.shouldPlayCircularEffect)
            this.sharedMemory.effectInstanceIds.circular = SlideConnector.spawnCircularEffect(
                this.data.lane,
            )

        if (SlideConnector.shouldPlayLinearEffect)
            this.sharedMemory.effectInstanceIds.linear = SlideConnector.spawnLinearEffect(
                this.data.lane,
            )
    }

    continueSlideEffects() {
        if (SlideConnector.shouldPlaySFX)
            this.sharedMemory.clipInstanceId = this.prevSharedMemory.clipInstanceId

        if (SlideConnector.shouldPlayCircularEffect)
            this.sharedMemory.effectInstanceIds.circular =
                this.prevSharedMemory.effectInstanceIds.circular

        if (SlideConnector.shouldPlayLinearEffect)
            this.sharedMemory.effectInstanceIds.linear =
                this.prevSharedMemory.effectInstanceIds.linear
    }

    endSlideEffects() {
        if (SlideConnector.shouldPlaySFX)
            effect.clips.stopLoop(this.prevSharedMemory.clipInstanceId)

        if (SlideConnector.shouldPlayCircularEffect)
            particle.effects.destroy(this.prevSharedMemory.effectInstanceIds.circular)

        if (SlideConnector.shouldPlayLinearEffect)
            particle.effects.destroy(this.prevSharedMemory.effectInstanceIds.linear)
    }
}
