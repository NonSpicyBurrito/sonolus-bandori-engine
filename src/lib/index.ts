import { readFileSync } from 'fs'

export * from './convert'

export const hashes = require(__dirname + '/info').hashes as {
    engineConfiguration: string
    engineData: string
}

export const engineConfiguration = readFileSync(
    __dirname + '/EngineConfiguration'
)

export const engineData = readFileSync(__dirname + '/EngineData')
