import {
    EngineArchetypeDataName,
    EngineArchetypeName,
    LevelData,
    LevelDataEntity,
} from 'sonolus-core'
import {
    BPMObject,
    BestdoriChart,
    ChartObject,
    DirectionalObject,
    LongObject,
    SingleObject,
    SlideObject,
    SystemObject,
} from './index.cjs'

type Intermediate = {
    archetype: string
    data: Record<string, number | Intermediate>
    sim: boolean
}

type Append = (intermediate: Intermediate) => void

type Handler<T extends ChartObject> = (object: T, append: Append) => void

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
        if (entity) entity.ref = ref

        return ref
    }

    const append: Append = (intermediate) => {
        const entity: LevelDataEntity = {
            archetype: intermediate.archetype,
            data: [],
        }

        if (intermediate.sim) {
            const beat = intermediate.data[EngineArchetypeDataName.Beat]
            if (typeof beat !== 'number') throw 'Unexpected beat'

            const intermediates = beatToIntermediates.get(beat)
            if (intermediates) {
                intermediates.push(intermediate)
            } else {
                beatToIntermediates.set(beat, [intermediate])
            }
        }

        const ref = intermediateToRef.get(intermediate)
        if (ref) entity.ref = ref

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
        archetype: 'InputManager',
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

const bpm: Handler<BPMObject> = (object, append) =>
    append({
        archetype: EngineArchetypeName.BpmChange,
        data: {
            [EngineArchetypeDataName.Beat]: object.beat,
            [EngineArchetypeDataName.Bpm]: object.bpm,
        },
        sim: false,
    })

const single: Handler<SingleObject> = (object, append) =>
    append({
        archetype: object.flick ? 'FlickNote' : 'TapNote',
        data: {
            [EngineArchetypeDataName.Beat]: object.beat,
            lane: object.lane - 3,
        },
        sim: true,
    })

const directional: Handler<DirectionalObject> = (object, append) =>
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

const longAndSlide: Handler<LongObject | SlideObject> = (object, append) => {
    let start: Intermediate | undefined
    let head: Intermediate | undefined
    const connectors: Intermediate[] = []

    const connectorArchetype = object.connections
        .slice(1, -1)
        .some((connection) => connection.hidden)
        ? 'CurvedSlideConnector'
        : 'StraightSlideConnector'

    for (const [i, connection] of object.connections.entries()) {
        if (i === 0) {
            start = head = {
                archetype: 'SlideStartNote',
                data: {
                    [EngineArchetypeDataName.Beat]: connection.beat,
                    lane: connection.lane - 3,
                },
                sim: true,
            }
            append(start)
            continue
        }

        if (!start) throw 'Unexpected missing start'
        if (!head) throw 'Unexpected missing head'

        if (i === object.connections.length - 1) {
            const tail: Intermediate = {
                archetype: connection.flick ? 'SlideEndFlickNote' : 'SlideEndNote',
                data: {
                    [EngineArchetypeDataName.Beat]: connection.beat,
                    lane: connection.lane - 3,
                    prev: start,
                },
                sim: true,
            }

            if (connection.flick) {
                tail.data.long =
                    object.connections.length === 2 && head.data.lane === tail.data.lane ? 1 : 0
            }

            append(tail)

            connectors.push({
                archetype: connectorArchetype,
                data: {
                    start,
                    head,
                    tail,
                },
                sim: false,
            })

            for (const connector of connectors) {
                connector.data.end = tail
                append(connector)
            }
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
            append(tail)

            connectors.push({
                archetype: connectorArchetype,
                data: {
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
                prev: start,
            },
            sim: false,
        }
        append(tail)

        connectors.push({
            archetype: connectorArchetype,
            data: {
                start,
                head,
                tail,
            },
            sim: false,
        })

        for (const connector of connectors) {
            connector.data.end = tail
            append(connector)
        }
        connectors.length = 0

        start = head = tail
    }
}

const system: Handler<SystemObject> = () => {
    // noop
}

const handlers: {
    [K in ChartObject['type']]: Handler<Extract<ChartObject, { type: K }>>
} = {
    BPM: bpm,
    Single: single,
    Directional: directional,
    Long: longAndSlide,
    Slide: longAndSlide,
    System: system,
}

const repair = (objects: ChartObject[]) => {
    const replace = (o: ChartObject, n: ChartObject) => objects.splice(objects.indexOf(o), 1, n)

    const remove = (o: ChartObject) => objects.splice(objects.indexOf(o), 1)

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

                        const single: SingleObject = {
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
