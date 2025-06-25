import { DatabaseEngineItem } from '@sonolus/core'

export { bestdoriToLevelData } from './bestdori/convert.cjs'
export * from './bestdori/index.cjs'

export const version = '1.5.6'

export const databaseEngineItem = {
    name: 'bandori',
    version: 13,
    title: {
        en: 'BanG Dream!',
        ja: 'バンドリ！',
        ko: '뱅드림!',
        zhs: 'BanG Dream!',
        zht: 'BanG Dream!',
    },
    subtitle: {
        en: 'BanG Dream! Girls Band Party!',
        ja: 'バンドリ！ ガールズバンドパーティ！',
        ko: '뱅드림! 걸즈 밴드 파티!',
        zhs: 'BanG Dream! 少女乐团派对!',
        zht: 'BanG Dream! 少女樂團派對',
    },
    author: {
        en: 'Burrito#1000',
    },
    description: {
        en: [
            'A recreation of BanG Dream! Girls Band Party engine in Sonolus.',
            '',
            'Version:',
            version,
            '',
            'GitHub Repository:',
            'https://github.com/NonSpicyBurrito/sonolus-bandori-engine',
        ].join('\n'),
    },
} as const satisfies Partial<DatabaseEngineItem>
