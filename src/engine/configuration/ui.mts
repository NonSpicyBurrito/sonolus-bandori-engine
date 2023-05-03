import { EngineConfigurationUI } from 'sonolus-core'

export const ui: EngineConfigurationUI = {
    scope: 'Bandori',
    primaryMetric: 'arcade',
    secondaryMetric: 'life',
    menuVisibility: {
        scale: 1,
        alpha: 1,
    },
    judgmentVisibility: {
        scale: 1,
        alpha: 1,
    },
    comboVisibility: {
        scale: 1,
        alpha: 1,
    },
    primaryMetricVisibility: {
        scale: 1,
        alpha: 1,
    },
    secondaryMetricVisibility: {
        scale: 1,
        alpha: 1,
    },
    judgmentAnimation: {
        scale: {
            from: 1,
            to: 1,
            duration: 0,
            ease: 'Linear',
        },
        alpha: {
            from: 1,
            to: 0,
            duration: 0.2,
            ease: 'InQuart',
        },
    },
    comboAnimation: {
        scale: {
            from: 1.2,
            to: 1,
            duration: 0.2,
            ease: 'InBack',
        },
        alpha: {
            from: 1,
            to: 1,
            duration: 0,
            ease: 'Linear',
        },
    },
    judgmentErrorStyle: 'arrowDown',
    judgmentErrorPlacement: 'both',
    judgmentErrorMin: 20,
}
