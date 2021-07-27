import { serve } from 'sonolus.js'

import { buildOutput } from '.'

const sonolus = serve(buildOutput)

const level = sonolus.db.levels[0]
level.cover = {
    type: 'LevelCover',
    hash: '',
    url:
        'https://bestdori.com/assets/jp/musicjacket/musicjacket260_rip/assets-star-forassetbundle-startapp-musicjacket-musicjacket260-253_loki-jacket.png',
}
level.bgm = {
    type: 'LevelBgm',
    hash: '',
    url: 'https://bestdori.com/assets/jp/sound/bgm253_rip/bgm253.mp3',
}
