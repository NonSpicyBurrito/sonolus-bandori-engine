import { readFileSync } from 'node:fs'
import { LevelData } from 'sonolus-core'

export const data: LevelData = JSON.parse(readFileSync('./src/level/data/special.json', 'utf8'))
