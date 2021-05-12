import { SEntity, SLevelData } from 'sonolus.js'

type ChartObject =
    | SingleObject
    | DirectionalObject
    | SlideObject
    | LongObject
    | BPMObject
    | SystemObject

type ObjectBase = {
    beat: number
}

type NoteBase = ObjectBase & {
    lane: number
    flick?: true
    skill?: true
    charge?: true
}

type SingleObject = NoteBase & {
    type: 'Single'
}

type DirectionalObject = NoteBase & {
    type: 'Directional'
    direction: 'Left' | 'Right'
    width: number
}

type SlideObject = {
    type: 'Slide'
    connections: Connection[]
}

type LongObject = {
    type: 'Long'
    connections: Connection[]
}

type Connection = NoteBase & {
    hidden?: true
}

type BPMObject = ObjectBase & {
    type: 'BPM'
    bpm: number
}

type SystemObject = ObjectBase & {
    type: 'System'
    data: string
}

export function fromBestdori(
    data: ChartObject[],
    archetypes: {
        initializationIndex: number
        stageIndex: number
        tapNoteIndex: number
        flickNoteIndex: number
        directionalFlickNoteIndex: number
        slideStartNoteIndex: number
        slideTickNoteIndex: number
        slideEndNoteIndex: number
        slideFlickNoteIndex: number
        straightSliderIndex: number
        curvedSliderIndex: number
    } = require(__dirname + '/info').archetypes
): SLevelData {
    type WrappedNoteEntity = {
        entity: SEntity
        time: number
        lane: number
        head?: WrappedNoteEntity
    }

    type WrappedSliderEntity = {
        entity: SEntity
        head: WrappedNoteEntity
        tail: WrappedNoteEntity
    }

    const chartObjects = repair(data)

    const timings: {
        beat: number
        time: number
        timePerBeat: number
    }[] = []

    let timePerBeat = 0
    let beats = 0
    let time = 0
    chartObjects.forEach((chartObject) => {
        if (chartObject.type === 'BPM') {
            time += (chartObject.beat - beats) * timePerBeat
            beats = chartObject.beat
            timePerBeat = 60 / chartObject.bpm
            timings.unshift({
                beat: beats,
                time,
                timePerBeat,
            })
        }
    })

    const wrappedNoteEntities: WrappedNoteEntity[] = [
        {
            entity: {
                archetype: archetypes.initializationIndex,
            },
            time: Number.NEGATIVE_INFINITY,
            lane: 0,
        },
        {
            entity: {
                archetype: archetypes.stageIndex,
            },
            time: Number.NEGATIVE_INFINITY,
            lane: 0,
        },
    ]
    const wrappedSliderEntities: WrappedSliderEntity[] = []

    chartObjects.forEach((chartObject) => {
        switch (chartObject.type) {
            case 'Single': {
                const time = beatToTime(chartObject.beat)
                const lane = chartObject.lane - 3
                wrappedNoteEntities.push({
                    entity: {
                        archetype: chartObject.flick
                            ? archetypes.flickNoteIndex
                            : archetypes.tapNoteIndex,
                        data: {
                            index: 1,
                            values: [time, lane],
                        },
                    },
                    time,
                    lane,
                })
                break
            }
            case 'Directional': {
                const time = beatToTime(chartObject.beat)
                const lane = chartObject.lane - 3
                wrappedNoteEntities.push({
                    entity: {
                        archetype: archetypes.directionalFlickNoteIndex,
                        data: {
                            index: 1,
                            values: [
                                time,
                                lane,
                                chartObject.width - 1,
                                chartObject.direction === 'Left' ? 1 : 0,
                            ],
                        },
                    },
                    time,
                    lane,
                })
                break
            }
            case 'Slide':
            case 'Long': {
                let segments: {
                    time: number
                    lane: number
                }[] = []
                chartObject.connections.forEach((connection, index) => {
                    const time = beatToTime(connection.beat)
                    const lane = connection.lane - 3
                    if (connection.hidden) {
                        segments.push({
                            time,
                            lane,
                        })
                    } else {
                        if (index === 0) {
                            wrappedNoteEntities.push({
                                entity: {
                                    archetype: archetypes.slideStartNoteIndex,
                                    data: {
                                        index: 1,
                                        values: [time, lane],
                                    },
                                },
                                time,
                                lane,
                            })
                        } else {
                            const head =
                                wrappedNoteEntities[
                                    wrappedNoteEntities.length - 1
                                ]
                            if (index === chartObject.connections.length - 1) {
                                wrappedNoteEntities.push({
                                    entity: {
                                        archetype: connection.flick
                                            ? archetypes.slideFlickNoteIndex
                                            : archetypes.slideEndNoteIndex,
                                        data: {
                                            index: 0,
                                            values: [0, time, lane],
                                        },
                                    },
                                    time,
                                    lane,
                                    head,
                                })
                            } else {
                                wrappedNoteEntities.push({
                                    entity: {
                                        archetype:
                                            archetypes.slideTickNoteIndex,
                                        data: {
                                            index: 0,
                                            values: [0, time, lane],
                                        },
                                    },
                                    time,
                                    lane,
                                    head,
                                })
                            }
                            segments.push({
                                time,
                                lane,
                            })

                            const tail =
                                wrappedNoteEntities[
                                    wrappedNoteEntities.length - 1
                                ]
                            const archetype = chartObject.connections.some(
                                (connection) => connection.hidden
                            )
                                ? archetypes.curvedSliderIndex
                                : archetypes.straightSliderIndex
                            let prevSegment = {
                                time: head.time,
                                lane: head.lane,
                            }
                            segments.forEach((segment, index) => {
                                wrappedSliderEntities.push({
                                    entity: {
                                        archetype,
                                        data: {
                                            index: 0,
                                            values: [
                                                0,
                                                0,
                                                prevSegment.time,
                                                segment.time,
                                                prevSegment.lane,
                                                segment.lane,
                                                index === 0 ? 1 : 0,
                                            ],
                                        },
                                    },
                                    head,
                                    tail,
                                })
                                prevSegment = segment
                            })
                            segments = []
                        }
                    }
                })
                break
            }
        }
    })

    return {
        entities: [
            ...wrappedNoteEntities
                .sort(
                    (a, b) =>
                        a.time - b.time || Math.abs(b.lane) - Math.abs(a.lane)
                )
                .map((wrappedNoteEntity) => {
                    if (wrappedNoteEntity.head) {
                        wrappedNoteEntity.entity.data!.values[0] = wrappedNoteEntities.indexOf(
                            wrappedNoteEntity.head
                        )
                    }
                    return wrappedNoteEntity.entity
                }),
            ...wrappedSliderEntities.map((wrappedSliderEntity) => {
                wrappedSliderEntity.entity.data!.values[0] = wrappedNoteEntities.indexOf(
                    wrappedSliderEntity.head
                )
                wrappedSliderEntity.entity.data!.values[1] = wrappedNoteEntities.indexOf(
                    wrappedSliderEntity.tail
                )
                return wrappedSliderEntity.entity
            }),
        ],
    }

    function beatToTime(beat: number) {
        for (const timing of timings) {
            if (beat >= timing.beat) {
                return timing.time + (beat - timing.beat) * timing.timePerBeat
            }
        }
        return 0
    }
}

function repair(chartObjects: ChartObject[]) {
    chartObjects.forEach((chartObject) => {
        switch (chartObject.type) {
            case 'Long':
            case 'Slide':
                chartObject.connections.sort((a, b) => a.beat - b.beat)
                const visibleConnections = chartObject.connections.filter(
                    (connection) => !connection.hidden
                )
                switch (visibleConnections.length) {
                    case 0:
                        remove(chartObject)
                        break
                    case 1:
                        const connection = visibleConnections[0]
                        replace(chartObject, {
                            type: 'Single',
                            lane: connection.lane,
                            beat: connection.beat,
                            flick: connection.flick,
                        })
                        break
                    default:
                        while (chartObject.connections[0]?.hidden) {
                            chartObject.connections.shift()
                        }
                        while (
                            chartObject.connections[
                                chartObject.connections.length - 1
                            ]?.hidden
                        ) {
                            chartObject.connections.pop()
                        }
                        break
                }
                break
        }
    })

    return chartObjects

    function replace(o: ChartObject, n: ChartObject) {
        chartObjects.splice(chartObjects.indexOf(o), 1, n)
    }

    function remove(o: ChartObject) {
        chartObjects.splice(chartObjects.indexOf(o), 1)
    }
}
