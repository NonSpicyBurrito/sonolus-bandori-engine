import { EffectClipName } from 'sonolus-core'

export const effect = defineEffect({
    clips: {
        stage: EffectClipName.Stage,

        tapPerfect: EffectClipName.Perfect,
        tapGreat: EffectClipName.Great,
        tapGood: EffectClipName.Good,

        flickPerfect: EffectClipName.PerfectAlternative,
        flickGreat: EffectClipName.GreatAlternative,
        flickGood: EffectClipName.GoodAlternative,

        directionalFlickSingle: 'Bandori Directional Flick Single',
        directionalFlickDouble: 'Bandori Directional Flick Double',
        directionalFlickTriple: 'Bandori Directional Flick Triple',

        hold: EffectClipName.Hold,
    },
})
