import { emptyDirSync, outputFileSync, outputJsonSync } from 'fs-extra'

import { buildOutput } from '.'
import { archetypes } from './engine/data/archetypes'

const distPath = 'dist'

emptyDirSync(distPath)

outputFileSync(
    `${distPath}/EngineConfiguration`,
    buildOutput.engine.configuration.buffer
)

outputFileSync(`${distPath}/EngineData`, buildOutput.engine.data.buffer)

outputJsonSync(`${distPath}/info.json`, {
    hashes: {
        engineConfiguration: buildOutput.engine.configuration.hash,
        engineData: buildOutput.engine.data.hash,
    },
    archetypes: Object.fromEntries(
        Object.entries(archetypes).filter(([key]) => key.endsWith('Index'))
    ),
})
