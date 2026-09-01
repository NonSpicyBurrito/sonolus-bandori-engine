import { EngineConfigurationOptionCategory, Text } from '@sonolus/core'

export const optionCategories = [
    {
        name: 'gameplay',
        title: Text.Gameplay,
    },
    {
        name: 'graphics',
        title: Text.Graphics,
    },
    {
        name: 'audio',
        title: Text.Audio,
    },
    {
        name: 'miscellaneous',
        title: Text.Miscellaneous,
    },
] satisfies EngineConfigurationOptionCategory[]
