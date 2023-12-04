import { EffectClipName } from 'sonolus-core'

export const effect = defineEffect({
    clips: {
        tapPerfect: EffectClipName.Perfect,

        flickPerfect: EffectClipName.PerfectAlternative,

        directionalFlickSingle: 'Bandori Directional Flick Single',
        directionalFlickDouble: 'Bandori Directional Flick Double',
        directionalFlickTriple: 'Bandori Directional Flick Triple',

        hold: EffectClipName.Hold,
    },
})

export const sfxDistance = 0.02
