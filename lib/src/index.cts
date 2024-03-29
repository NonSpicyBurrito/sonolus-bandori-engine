import { EngineInfo } from 'sonolus-core'
import { Resource } from './Resource.cjs'

export { bestdoriToLevelData } from './bestdori/convert.cjs'
export * from './bestdori/index.cjs'

export const version = '1.3.0'

export const engineInfo = {
    name: 'bandori',
    version: 11,
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
        en: 'Burrito',
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
} as const satisfies Partial<EngineInfo>

export const engineConfiguration = new Resource('EngineConfiguration')
export const enginePlayData = new Resource('EnginePlayData')
export const engineWatchData = new Resource('EngineWatchData')
export const enginePreviewData = new Resource('EnginePreviewData')
export const engineTutorialData = new Resource('EngineTutorialData')
export const engineThumbnail = new Resource('thumbnail.png')
