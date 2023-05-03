import { copyFileSync } from 'node:fs'

/** @type import('sonolus.js').SonolusCLIConfig */
export default {
    entry: './src/index.mts',
    devServer(sonolus) {
        copyFileSync('./src/level/bgm.mp3', './.dev/bgm.mp3')

        const level = sonolus.db.levels[0]
        level.bgm = {
            type: 'LevelBgm',
            hash: '009877eed240a060d485e5c978b0e37fcc7b9ecd',
            url: '/bgm.mp3',
        }
    },
}
