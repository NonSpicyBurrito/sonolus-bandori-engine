import {
    EngineArchetypeDataName,
    EngineArchetypeName,
    LevelData,
    LevelDataEntity,
} from '@sonolus/core'
import {
    BestdoriBpmObject,
    BestdoriChart,
    BestdoriDirectionalNote,
    BestdoriLongNote,
    BestdoriObject,
    BestdoriSingleNote,
    BestdoriSlideNote,
    BestdoriSystemObject,
} from './index.cjs'

type Intermediate = {
    archetype: string
    data: Record<string, number | Intermediate>
    sim: boolean
}

type Append = (intermediate: Intermediate) => void

type Handler<T extends BestdoriObject> = (object: T, append: Append) => void

export function bestdoriToLevelData(chart: BestdoriChart, offset = 0): LevelData {
    const entities: LevelDataEntity[] = []

    const beatToIntermediates = new Map<number, Intermediate[]>()

    const intermediateToRef = new Map<Intermediate, string>()
    const intermediateToEntity = new Map<Intermediate, LevelDataEntity>()

    let i = 0
    const getRef = (intermediate: Intermediate) => {
        let ref = intermediateToRef.get(intermediate)
        if (ref) return ref

        ref = (i++).toString(36)
        intermediateToRef.set(intermediate, ref)

        const entity = intermediateToEntity.get(intermediate)
        if (entity) entity.name = ref

        return ref
    }

    const append: Append = (intermediate) => {
        const entity: LevelDataEntity = {
            archetype: intermediate.archetype,
            data: [],
        }

        if (intermediate.sim) {
            const beat = intermediate.data[EngineArchetypeDataName.Beat]
            if (typeof beat !== 'number') throw new Error('Unexpected beat')

            const intermediates = beatToIntermediates.get(beat)
            if (intermediates) {
                intermediates.push(intermediate)
            } else {
                beatToIntermediates.set(beat, [intermediate])
            }
        }

        const ref = intermediateToRef.get(intermediate)
        if (ref) entity.name = ref

        intermediateToEntity.set(intermediate, entity)
        entities.push(entity)

        for (const [name, value] of Object.entries(intermediate.data)) {
            if (typeof value === 'number') {
                entity.data.push({
                    name,
                    value,
                })
            } else {
                entity.data.push({
                    name,
                    ref: getRef(value),
                })
            }
        }
    }

    append({
        archetype: 'Initialization',
        data: {},
        sim: false,
    })
    append({
        archetype: 'Stage',
        data: {},
        sim: false,
    })

    const objects = repair(chart)

    for (const object of objects) {
        handlers[object.type](object as never, append)
    }

    for (const intermediates of beatToIntermediates.values()) {
        for (let i = 1; i < intermediates.length; i++) {
            append({
                archetype: 'SimLine',
                data: {
                    a: intermediates[i - 1],
                    b: intermediates[i],
                },
                sim: false,
            })
        }
    }

    return {
        bgmOffset: offset,
        entities,
    }
}

const bpm: Handler<BestdoriBpmObject> = (object, append) => {
    append({
        archetype: EngineArchetypeName.BpmChange,
        data: {
            [EngineArchetypeDataName.Beat]: object.beat,
            [EngineArchetypeDataName.Bpm]: object.bpm,
        },
        sim: false,
    })
}

const single: Handler<BestdoriSingleNote> = (object, append) => {
    append({
        archetype: object.flick ? 'FlickNote' : 'TapNote',
        data: {
            [EngineArchetypeDataName.Beat]: object.beat,
            lane: object.lane - 3,
        },
        sim: true,
    })
}

const directional: Handler<BestdoriDirectionalNote> = (object, append) => {
    append({
        archetype: 'DirectionalFlickNote',
        data: {
            [EngineArchetypeDataName.Beat]: object.beat,
            lane: object.lane - 3,
            direction: object.direction === 'Left' ? -1 : 1,
            size: object.width,
        },
        sim: true,
    })
}

const longAndSlide: Handler<BestdoriLongNote | BestdoriSlideNote> = (object, append) => {
    let first: Intermediate | undefined
    let start: Intermediate | undefined
    let head: Intermediate | undefined
    const connectors: Intermediate[] = []

    const appends: Intermediate[] = []

    const connectorArchetype = object.connections
        .slice(1, -1)
        .some((connection) => connection.hidden)
        ? 'CurvedSlideConnector'
        : 'StraightSlideConnector'

    for (const [i, connection] of object.connections.entries()) {
        if (i === 0) {
            first =
                start =
                head =
                    {
                        archetype: 'SlideStartNote',
                        data: {
                            [EngineArchetypeDataName.Beat]: connection.beat,
                            lane: connection.lane - 3,
                        },
                        sim: true,
                    }
            appends.push(first)
            continue
        }

        if (!first) throw new Error('Unexpected missing first')
        if (!start) throw new Error('Unexpected missing start')
        if (!head) throw new Error('Unexpected missing head')

        if (i === object.connections.length - 1) {
            const tail: Intermediate = {
                archetype: connection.flick ? 'SlideEndFlickNote' : 'SlideEndNote',
                data: {
                    [EngineArchetypeDataName.Beat]: connection.beat,
                    lane: connection.lane - 3,
                    first,
                    prev: start,
                },
                sim: true,
            }

            if (connection.flick) {
                tail.data.long =
                    object.connections.length === 2 && head.data.lane === tail.data.lane ? 1 : 0
            }

            appends.push(tail)

            first.data.last = tail

            connectors.push({
                archetype: connectorArchetype,
                data: {
                    first,
                    start,
                    head,
                    tail,
                },
                sim: false,
            })

            for (const connector of connectors) {
                connector.data.end = tail
            }

            appends.push(...connectors)
            connectors.length = 0
            continue
        }

        if (connection.hidden) {
            const tail = {
                archetype: 'IgnoredNote',
                data: {
                    [EngineArchetypeDataName.Beat]: connection.beat,
                    lane: connection.lane - 3,
                },
                sim: false,
            }
            appends.push(tail)

            connectors.push({
                archetype: connectorArchetype,
                data: {
                    first,
                    start,
                    head,
                    tail,
                },
                sim: false,
            })

            head = tail
            continue
        }

        const tail = {
            archetype: 'SlideTickNote',
            data: {
                [EngineArchetypeDataName.Beat]: connection.beat,
                lane: connection.lane - 3,
                first,
                prev: start,
            },
            sim: false,
        }
        appends.push(tail)

        connectors.push({
            archetype: connectorArchetype,
            data: {
                first,
                start,
                head,
                tail,
            },
            sim: false,
        })

        for (const connector of connectors) {
            connector.data.end = tail
        }

        appends.push(...connectors)
        connectors.length = 0

        start = head = tail
    }

    for (const intermediate of appends) {
        append(intermediate)
    }
}

const system: Handler<BestdoriSystemObject> = () => {
    // noop
}

const handlers: {
    [K in BestdoriObject['type']]: Handler<Extract<BestdoriObject, { type: K }>>
} = {
    BPM: bpm,
    Single: single,
    Directional: directional,
    Long: longAndSlide,
    Slide: longAndSlide,
    System: system,
}

const repair = (objects: BestdoriObject[]) => {
    const replace = (o: BestdoriObject, n: BestdoriObject) =>
        objects.splice(objects.indexOf(o), 1, n)

    const remove = (o: BestdoriObject) => objects.splice(objects.indexOf(o), 1)

    for (const object of objects) {
        switch (object.type) {
            case 'Long':
            case 'Slide': {
                object.connections.sort((a, b) => a.beat - b.beat)

                const visibleConnections = object.connections.filter(
                    (connection) => !connection.hidden,
                )

                switch (visibleConnections.length) {
                    case 0:
                        remove(object)
                        break
                    case 1: {
                        const connection = visibleConnections[0]

                        const single: BestdoriSingleNote = {
                            type: 'Single',
                            lane: connection.lane,
                            beat: connection.beat,
                        }
                        if (connection.flick) single.flick = connection.flick

                        replace(object, single)
                        break
                    }
                    default:
                        while (object.connections[0].hidden) {
                            object.connections.shift()
                        }
                        while (object.connections[object.connections.length - 1].hidden) {
                            object.connections.pop()
                        }
                        break
                }
                break
            }
        }
    }

    return objects
}
