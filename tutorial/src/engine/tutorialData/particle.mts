import { ParticleEffectName } from '@sonolus/core'

export const particle = defineParticle({
    effects: {
        lane: ParticleEffectName.LaneLinear,

        tapNoteCircular: ParticleEffectName.NoteCircularTapCyan,
        tapNoteLinear: ParticleEffectName.NoteLinearTapCyan,

        flickNoteCircular: ParticleEffectName.NoteCircularAlternativeRed,
        flickNoteLinear: ParticleEffectName.NoteLinearAlternativeRed,

        directionalFlickNoteLeftCircular: 'Bandori Circular Directional Flick Left',
        directionalFlickNoteLeftLinear: 'Bandori Linear Directional Flick Left',
        directionalFlickNoteLeftCircularFallback: ParticleEffectName.NoteCircularAlternativePurple,
        directionalFlickNoteLeftLinearFallback: ParticleEffectName.NoteLinearAlternativePurple,

        directionalFlickNoteRightCircular: 'Bandori Circular Directional Flick Right',
        directionalFlickNoteRightLinear: 'Bandori Linear Directional Flick Right',
        directionalFlickNoteRightCircularFallback: ParticleEffectName.NoteCircularAlternativeYellow,
        directionalFlickNoteRightLinearFallback: ParticleEffectName.NoteLinearAlternativeYellow,

        holdCircular: ParticleEffectName.NoteCircularHoldGreen,
        holdLinear: ParticleEffectName.NoteLinearHoldGreen,
    },
})
