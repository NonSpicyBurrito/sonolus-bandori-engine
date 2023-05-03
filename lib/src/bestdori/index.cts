export type BestdoriChart = ChartObject[]

export type ChartObject =
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

export type SingleObject = NoteBase & {
    type: 'Single'
}

export type DirectionalObject = NoteBase & {
    type: 'Directional'
    direction: 'Left' | 'Right'
    width: number
}

export type SlideObject = {
    type: 'Slide'
    connections: Connection[]
}

export type LongObject = {
    type: 'Long'
    connections: Connection[]
}

export type Connection = NoteBase & {
    hidden?: true
}

export type BPMObject = ObjectBase & {
    type: 'BPM'
    bpm: number
}

export type SystemObject = ObjectBase & {
    type: 'System'
    data: string
}
