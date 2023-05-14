import { NameText, UnitText } from 'sonolus-core'

export const options = defineOptions({
    autoplay: {
        name: NameText.AutoPlay,
        scope: 'Bandori',
        standard: true,
        type: 'toggle',
        def: 0,
    },
    strictJudgment: {
        name: NameText.StrictJudgment,
        scope: 'Bandori',
        standard: true,
        type: 'toggle',
        def: 0,
    },
    speed: {
        name: NameText.LevelSpeed,
        standard: true,
        type: 'slider',
        def: 1,
        min: 0.5,
        max: 2,
        step: 0.05,
        unit: UnitText.Percentage,
    },
    hidden: {
        name: NameText.Hidden,
        standard: true,
        type: 'slider',
        def: 0,
        min: 0,
        max: 1,
        step: 0.05,
        unit: UnitText.Percentage,
    },
    noteSpeed: {
        name: NameText.NoteSpeed,
        scope: 'Bandori',
        type: 'slider',
        def: 5,
        min: 1,
        max: 15.9,
        step: 0.1,
    },
    mirror: {
        name: NameText.MirrorLevel,
        type: 'toggle',
        def: 0,
    },
    sfxEnabled: {
        name: NameText.SFX,
        scope: 'Bandori',
        type: 'toggle',
        def: 1,
    },
    autoSFX: {
        name: NameText.AutoSFX,
        scope: 'Bandori',
        type: 'toggle',
        def: 0,
    },
    noteSize: {
        name: NameText.NoteSize,
        scope: 'Bandori',
        type: 'slider',
        def: 1,
        min: 0.1,
        max: 2,
        step: 0.05,
        unit: UnitText.Percentage,
    },
    noteEffectEnabled: {
        name: NameText.NoteEffect,
        scope: 'Bandori',
        type: 'toggle',
        def: 1,
    },
    noteEffectSize: {
        name: NameText.NoteEffectSize,
        scope: 'Bandori',
        type: 'slider',
        def: 1,
        min: 0.1,
        max: 2,
        step: 0.05,
        unit: UnitText.Percentage,
    },
    markerAnimation: {
        name: NameText.MarkerAnimation,
        scope: 'Bandori',
        type: 'toggle',
        def: 1,
    },
    simLineEnabled: {
        name: NameText.SimultaneousLineVisibility,
        scope: 'Bandori',
        type: 'toggle',
        def: 1,
    },
    connectorAlpha: {
        name: NameText.ConnectorTransparency,
        scope: 'Bandori',
        type: 'slider',
        def: 0.8,
        min: 0.1,
        max: 1,
        step: 0.05,
        unit: UnitText.Percentage,
    },
    laneEffectEnabled: {
        name: NameText.LaneEffect,
        scope: 'Bandori',
        type: 'toggle',
        def: 1,
    },
    slotEffectEnabled: {
        name: NameText.SlotEffect,
        scope: 'Bandori',
        type: 'toggle',
        def: 1,
    },
    slotEffectSize: {
        name: NameText.SlotEffectSize,
        scope: 'Bandori',
        type: 'slider',
        def: 1,
        min: 0,
        max: 2,
        step: 0.05,
        unit: UnitText.Percentage,
    },
    stageCover: {
        name: NameText.VerticalStageCover,
        scope: 'Bandori',
        type: 'slider',
        def: 0,
        min: 0,
        max: 1,
        step: 0.05,
        unit: UnitText.Percentage,
    },
    lockStageAspectRatio: {
        name: NameText.LockStageAspectRatio,
        scope: 'Bandori',
        type: 'toggle',
        def: 1,
    },
})