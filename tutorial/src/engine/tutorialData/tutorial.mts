import { connector } from './components/connector.mjs'
import { flickArrow } from './components/flickArrow.mjs'
import { initialization } from './components/initialization.mjs'
import { noteDisplay } from './components/noteDisplay.mjs'
import { slide } from './components/slide.mjs'
import { stage } from './components/stage.mjs'
import { segment } from './segment.mjs'
import { directionalFlickLeftNoteFall } from './segments/directionalFlickLeftNote/fall.mjs'
import { directionalFlickLeftNoteFrozen } from './segments/directionalFlickLeftNote/frozen.mjs'
import { directionalFlickLeftNoteHit } from './segments/directionalFlickLeftNote/hit.mjs'
import { directionalFlickLeftNoteIntro } from './segments/directionalFlickLeftNote/intro.mjs'
import { directionalFlickRightNoteFall } from './segments/directionalFlickRightNote/fall.mjs'
import { directionalFlickRightNoteFrozen } from './segments/directionalFlickRightNote/frozen.mjs'
import { directionalFlickRightNoteHit } from './segments/directionalFlickRightNote/hit.mjs'
import { directionalFlickRightNoteIntro } from './segments/directionalFlickRightNote/intro.mjs'
import { flickNoteFall } from './segments/flickNote/fall.mjs'
import { flickNoteFrozen } from './segments/flickNote/frozen.mjs'
import { flickNoteHit } from './segments/flickNote/hit.mjs'
import { flickNoteIntro } from './segments/flickNote/intro.mjs'
import { slideEndFlickNoteFall } from './segments/slideEndFlickNote/fall.mjs'
import { slideEndFlickNoteFrozen } from './segments/slideEndFlickNote/frozen.mjs'
import { slideEndFlickNoteHit } from './segments/slideEndFlickNote/hit.mjs'
import { slideEndFlickNoteIntro } from './segments/slideEndFlickNote/intro.mjs'
import { slideEndNoteFall } from './segments/slideEndNote/fall.mjs'
import { slideEndNoteFrozen } from './segments/slideEndNote/frozen.mjs'
import { slideEndNoteHit } from './segments/slideEndNote/hit.mjs'
import { slideEndNoteIntro } from './segments/slideEndNote/intro.mjs'
import { slideStartNoteFall } from './segments/slideStartNote/fall.mjs'
import { slideStartNoteFrozen } from './segments/slideStartNote/frozen.mjs'
import { slideStartNoteHit } from './segments/slideStartNote/hit.mjs'
import { slideStartNoteIntro } from './segments/slideStartNote/intro.mjs'
import { tapNoteFall } from './segments/tapNote/fall.mjs'
import { tapNoteFrozen } from './segments/tapNote/frozen.mjs'
import { tapNoteHit } from './segments/tapNote/hit.mjs'
import { tapNoteIntro } from './segments/tapNote/intro.mjs'

const components = [initialization, stage, flickArrow, noteDisplay, slide, connector] as const

const segments = [
    tapNoteIntro,
    tapNoteFall,
    tapNoteFrozen,
    tapNoteHit,

    flickNoteIntro,
    flickNoteFall,
    flickNoteFrozen,
    flickNoteHit,

    directionalFlickLeftNoteIntro,
    directionalFlickLeftNoteFall,
    directionalFlickLeftNoteFrozen,
    directionalFlickLeftNoteHit,

    directionalFlickRightNoteIntro,
    directionalFlickRightNoteFall,
    directionalFlickRightNoteFrozen,
    directionalFlickRightNoteHit,

    slideStartNoteIntro,
    slideStartNoteFall,
    slideStartNoteFrozen,
    slideStartNoteHit,

    slideEndNoteIntro,
    slideEndNoteFall,
    slideEndNoteFrozen,
    slideEndNoteHit,

    slideEndFlickNoteIntro,
    slideEndFlickNoteFall,
    slideEndFlickNoteFrozen,
    slideEndFlickNoteHit,
] as const

const preprocess = () => {
    segment.current = -1
}

const preprocessComponent = (index: number) => {
    index -= 1

    const component = components[index]
    if (!('preprocess' in component)) return

    component.preprocess()
}

const navigate = () => {
    if (navigation.direction > 0) {
        segment.next = Math.mod(
            segment.current + navigation.direction * (segment.current % 4 ? 1 : 4),
            segments.length,
        )
    } else {
        segment.next = Math.mod(Math.floor(segment.current / 4) * 4 - 4, segments.length)
    }
}

const finishSegment = () => {
    if (segment.current !== segment.next) return
    if (time.now < segment.time.end) return

    segment.next = Math.mod(segment.current + 1, segments.length)
}

const exitCurrentSegment = (index: number) => {
    if (segment.current === segment.next) return

    index -= 1
    if (index !== segment.current) return

    const s = segments[index]
    if (!('exit' in s)) return

    s.exit()
}

const enterNextSegment = (index: number) => {
    if (segment.current === segment.next) return

    index -= 1 + segments.length
    if (index !== segment.next) return

    const s = segments[index]
    if (!('enter' in s)) return

    s.enter()
}

const moveNext = () => {
    if (segment.current === segment.next) return

    segment.current = segment.next

    segment.time.start = time.now
    segment.time.end = segment.time.start

    const index = segment.current % 4
    if (index === 0) {
        segment.time.end += 1
    } else if (index === 2) {
        segment.time.end += 4
    } else {
        segment.time.end += 2
    }
}

const updateSegmentTime = () => {
    segment.time.now = time.now - segment.time.start
}

const updateCurrentSegment = (index: number) => {
    index -= 3 + segments.length * 2
    if (index !== segment.current) return

    const s = segments[index]
    if (!('update' in s)) return

    s.update()
}

const updateComponent = (index: number) => {
    index -= 3 + segments.length * 3

    const component = components[index]
    if (!('update' in component)) return

    component.update()
}

const forEach = (items: readonly unknown[], callback: (index: number) => void) =>
    items.map(() => callback)

export const tutorial = {
    preprocess: [preprocess, ...forEach(components, preprocessComponent)],

    navigate: [navigate],

    update: [
        finishSegment,
        ...forEach(segments, exitCurrentSegment),
        ...forEach(segments, enterNextSegment),
        moveNext,
        updateSegmentTime,
        ...forEach(segments, updateCurrentSegment),
        ...forEach(components, updateComponent),
    ],
}
