import { SEntity, SLevelData } from 'sonolus.js'

type ChartObject = NoteObject | BPMObject | SystemObject

type ObjectBase = {
    beat: number
}

type NoteObjectBase = ObjectBase & {
    type: 'Note'
    lane: number
}

type NoteObject = SingleObject | SlideObject | LongObject

type SingleObject = NoteObjectBase & {
    note: 'Single'
    flick: boolean
}

type SlideObject = SlideStartObject | SlideTickObject | SlideEndObject

type SlideStartObject = NoteObjectBase & {
    note: 'Slide'
    pos: 'A' | 'B'
    start: true
    end: false
}

type SlideTickObject = NoteObjectBase & {
    note: 'Slide'
    pos: 'A' | 'B'
    start: false
    end: false
}

type SlideEndObject = NoteObjectBase & {
    note: 'Slide'
    pos: 'A' | 'B'
    start: false
    end: true
    flick: boolean
}

type LongObject = LongStartObject | LongEndObject

type LongStartObject = NoteObjectBase & {
    note: 'Long'
    start: true
    end: false
}

type LongEndObject = NoteObjectBase & {
    note: 'Long'
    start: false
    end: true
    flick: boolean
}

type BPMObject = ObjectBase & {
    type: 'System'
    cmd: 'BPM'
    bpm: number
}

type SystemObject = ObjectBase & {
    type: 'System'
    cmd: 'FeverReady' | 'FeverStart' | 'FeverEnd' | 'unknown'
}

export function fromBestdori(
    data: ChartObject[],
    archetypes: {
        initializationIndex: number
        stageIndex: number
        tapNoteIndex: number
        flickNoteIndex: number
        slideStartNoteIndex: number
        slideTickNoteIndex: number
        slideEndNoteIndex: number
        slideFlickNoteIndex: number
    } = require(__dirname + '/info').archetypes
): SLevelData {
    type Note = NoteObject & {
        time: number
        head?: Note
    }

    type WrappedEntity = {
        entity: SEntity
        note?: Note
    }

    const wrappedEntities: WrappedEntity[] = [
        {
            entity: {
                archetype: archetypes.initializationIndex,
            },
        },
        {
            entity: {
                archetype: archetypes.stageIndex,
            },
        },
    ]

    const notes = appendTime(repair(data)).filter(
        (obj): obj is Note => obj.type === 'Note'
    )
    notes.forEach((note, index) => {
        switch (note.note) {
            case 'Long':
                if (!note.start) {
                    for (let i = index - 1; i >= 0; i--) {
                        const head = notes[i]
                        if (
                            head.note === 'Long' &&
                            !head.end &&
                            head.lane === note.lane
                        ) {
                            note.head = head
                            break
                        }
                    }
                }
                break
            case 'Slide':
                if (!note.start) {
                    for (let i = index - 1; i >= 0; i--) {
                        const head = notes[i]
                        if (
                            head.note === 'Slide' &&
                            !head.end &&
                            head.pos === note.pos
                        ) {
                            note.head = head
                            break
                        }
                    }
                }
                break
        }
    })

    notes
        .sort(
            (a, b) =>
                a.time - b.time || Math.abs(b.lane - 4) - Math.abs(a.lane - 4)
        )
        .forEach((note) => {
            switch (note.note) {
                case 'Single':
                    wrappedEntities.push({
                        entity: {
                            archetype: note.flick
                                ? archetypes.flickNoteIndex
                                : archetypes.tapNoteIndex,
                            data: {
                                index: 1,
                                values: [note.time, note.lane - 4],
                            },
                        },
                        note,
                    })
                    break
                case 'Long':
                case 'Slide':
                    if (note.start) {
                        wrappedEntities.push({
                            entity: {
                                archetype: archetypes.slideStartNoteIndex,
                                data: {
                                    index: 1,
                                    values: [note.time, note.lane - 4],
                                },
                            },
                            note,
                        })
                    } else if (note.end) {
                        wrappedEntities.push({
                            entity: {
                                archetype: note.flick
                                    ? archetypes.slideFlickNoteIndex
                                    : archetypes.slideEndNoteIndex,
                                data: {
                                    index: 0,
                                    values: [
                                        wrappedEntities.findIndex(
                                            (entity) =>
                                                entity.note === note.head
                                        ),
                                        note.time,
                                        note.lane - 4,
                                    ],
                                },
                            },
                            note,
                        })
                    } else {
                        wrappedEntities.push({
                            entity: {
                                archetype: archetypes.slideTickNoteIndex,
                                data: {
                                    index: 0,
                                    values: [
                                        wrappedEntities.findIndex(
                                            (entity) =>
                                                entity.note === note.head
                                        ),
                                        note.time,
                                        note.lane - 4,
                                    ],
                                },
                            },
                            note,
                        })
                    }
                    break
            }
        })

    return {
        entities: wrappedEntities.map(({ entity }) => entity),
    }
}

function repair(chartObjects: ChartObject[]): ChartObject[] {
    const slides = new Map<string, SlideStartObject | SlideTickObject>()

    chartObjects.sort((a, b) => a.beat - b.beat)
    chartObjects.forEach((chartObject) => {
        if (chartObject.type === 'Note' && chartObject.note === 'Slide') {
            if (chartObject.start) {
                const prevSlide = slides.get(chartObject.pos)
                if (prevSlide !== undefined) {
                    if (prevSlide.start) {
                        replace(prevSlide, {
                            type: 'Note',
                            note: 'Single',
                            beat: prevSlide.beat,
                            lane: prevSlide.lane,
                            flick: false,
                        })
                    } else {
                        replace(prevSlide, {
                            type: 'Note',
                            note: 'Slide',
                            beat: prevSlide.beat,
                            lane: prevSlide.lane,
                            pos: prevSlide.pos,
                            start: false,
                            end: true,
                            flick: false,
                        })
                    }
                }

                slides.set(chartObject.pos, chartObject)
            } else if (chartObject.end) {
                const prevSlide = slides.get(chartObject.pos)
                if (prevSlide === undefined) {
                    replace(chartObject, {
                        type: 'Note',
                        note: 'Single',
                        beat: chartObject.beat,
                        lane: chartObject.lane,
                        flick: chartObject.flick,
                    })
                } else {
                    slides.delete(chartObject.pos)
                }
            } else {
                const prevSlide = slides.get(chartObject.pos)
                if (prevSlide === undefined) {
                    const newChartObject: SlideStartObject = {
                        type: 'Note',
                        note: 'Slide',
                        beat: chartObject.beat,
                        lane: chartObject.lane,
                        pos: chartObject.pos,
                        start: true,
                        end: false,
                    }
                    replace(chartObject, newChartObject)
                    chartObject = newChartObject
                }

                slides.set(chartObject.pos, chartObject)
            }
        }
    })

    slides.forEach((slideObject) => {
        if (slideObject.start) {
            replace(slideObject, {
                type: 'Note',
                note: 'Single',
                beat: slideObject.beat,
                lane: slideObject.lane,
                flick: false,
            })
        } else {
            replace(slideObject, {
                type: 'Note',
                note: 'Slide',
                beat: slideObject.beat,
                lane: slideObject.lane,
                pos: slideObject.pos,
                start: false,
                end: true,
                flick: false,
            })
        }
    })

    return chartObjects

    function replace(o: ChartObject, n: ChartObject) {
        chartObjects.splice(chartObjects.indexOf(o), 1, n)
    }
}

function appendTime(
    chartObjects: ChartObject[]
): (ChartObject & { time: number })[] {
    let timePerBeat = 0
    let totalTime = 0
    let totalBeats = 0

    return chartObjects.map((chartObject) => {
        const time = totalTime + (chartObject.beat - totalBeats) * timePerBeat

        if (chartObject.type === 'System' && chartObject.cmd === 'BPM') {
            timePerBeat = 60 / chartObject.bpm || 0
            totalTime = time
            totalBeats = chartObject.beat
        }

        return {
            ...chartObject,
            time,
        }
    })
}
