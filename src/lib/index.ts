import { readFileSync } from 'fs'

export * from './convert'

type Resource = {
    hash: string
    path: string
    buffer: Buffer
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hashes = require(`${__dirname}/info`).hashes as {
    engineConfiguration: string
    engineData: string
}

export const engineConfiguration: Resource = {
    hash: hashes.engineConfiguration,
    path: `${__dirname}/EngineConfiguration`,
    get buffer() {
        return readFileSync(this.path)
    },
}

export const engineData: Resource = {
    hash: hashes.engineData,
    path: `${__dirname}/EngineData`,
    get buffer() {
        return readFileSync(this.path)
    },
}
