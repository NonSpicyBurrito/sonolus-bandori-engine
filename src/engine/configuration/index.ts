import { SEngineConfiguration } from 'sonolus.js'
import { options } from './options'

export const engineConfiguration: SEngineConfiguration = {
    options,
    ui: {
        scope: 'Bandori',
        primaryMetric: 'arcade',
        secondaryMetric: 'life',
    },
}
