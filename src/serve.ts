import { serve } from 'sonolus.js'

import { buildOutput } from '.'

serve(buildOutput, {
    levelCover: {
        type: 'LevelCover',
        url:
            'https://bestdori.com/assets/jp/musicjacket/musicjacket260_rip/assets-star-forassetbundle-startapp-musicjacket-musicjacket260-253_loki-jacket.png',
    },
    levelBgm: {
        type: 'LevelBgm',
        url: 'https://bestdori.com/assets/jp/sound/bgm253_rip/bgm253.mp3',
    },
})
