import { readJsonSync } from 'fs-extra'
import { archetypes } from '../../engine/data/archetypes'
import { fromBestdori } from '../../lib/convert'

export const levelData = fromBestdori(readJsonSync(__dirname + '/level.json'), archetypes)
