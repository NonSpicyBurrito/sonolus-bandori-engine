import { LevelData } from 'sonolus-core'
import { ChartObject, fromBestdori as _fromBestdori } from './convert'
import { Resource } from './Resource'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const archetypes = require('./archetypes')

export const version = '0.6.7'

export const engineInfo = {
    name: 'bandori',
    version: 6,
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
} as const

export const engineConfiguration = new Resource('EngineConfiguration')
export const engineData = new Resource('EngineData')
export const engineThumbnail = new Resource('thumbnail.png')

export function fromBestdori(chart: ChartObject[]): LevelData {
    return _fromBestdori(chart, archetypes)
}
