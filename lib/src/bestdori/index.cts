export type BestdoriChart = BestdoriObject[]

export type BestdoriObject =
    | BestdoriSingleNote
    | BestdoriDirectionalNote
    | BestdoriSlideNote
    | BestdoriLongNote
    | BestdoriBPMObject
    | BestdoriSystemObject

type BaseBestdoriObject = {
    beat: number
}

type BaseBestdoriNote = BaseBestdoriObject & {
    lane: number
    flick?: true
    skill?: true
    charge?: true
}

export type BestdoriSingleNote = BaseBestdoriNote & {
    type: 'Single'
}

export type BestdoriDirectionalNote = BaseBestdoriNote & {
    type: 'Directional'
    direction: 'Left' | 'Right'
    width: number
}

export type BestdoriSlideNote = {
    type: 'Slide'
    connections: BestdoriConnectionNote[]
}

export type BestdoriLongNote = {
    type: 'Long'
    connections: BestdoriConnectionNote[]
}

export type BestdoriConnectionNote = BaseBestdoriNote & {
    hidden?: true
}

export type BestdoriBPMObject = BaseBestdoriObject & {
    type: 'BPM'
    bpm: number
}

export type BestdoriSystemObject = BaseBestdoriObject & {
    type: 'System'
    data: string
}
