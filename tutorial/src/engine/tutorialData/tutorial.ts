import { connector } from './components/connector.js'
import { flickArrow } from './components/flickArrow.js'
import { initialization } from './components/initialization.js'
import { noteDisplay } from './components/noteDisplay.js'
import { slide } from './components/slide.js'
import { stage } from './components/stage.js'
import { segment } from './segment.js'
import { directionalFlickLeftNoteFall } from './segments/directionalFlickLeftNote/fall.js'
import { directionalFlickLeftNoteFrozen } from './segments/directionalFlickLeftNote/frozen.js'
import { directionalFlickLeftNoteHit } from './segments/directionalFlickLeftNote/hit.js'
import { directionalFlickLeftNoteIntro } from './segments/directionalFlickLeftNote/intro.js'
import { directionalFlickRightNoteFall } from './segments/directionalFlickRightNote/fall.js'
import { directionalFlickRightNoteFrozen } from './segments/directionalFlickRightNote/frozen.js'
import { directionalFlickRightNoteHit } from './segments/directionalFlickRightNote/hit.js'
import { directionalFlickRightNoteIntro } from './segments/directionalFlickRightNote/intro.js'
import { flickNoteFall } from './segments/flickNote/fall.js'
import { flickNoteFrozen } from './segments/flickNote/frozen.js'
import { flickNoteHit } from './segments/flickNote/hit.js'
import { flickNoteIntro } from './segments/flickNote/intro.js'
import { slideEndFlickNoteFall } from './segments/slideEndFlickNote/fall.js'
import { slideEndFlickNoteFrozen } from './segments/slideEndFlickNote/frozen.js'
import { slideEndFlickNoteHit } from './segments/slideEndFlickNote/hit.js'
import { slideEndFlickNoteIntro } from './segments/slideEndFlickNote/intro.js'
import { slideEndNoteFall } from './segments/slideEndNote/fall.js'
import { slideEndNoteFrozen } from './segments/slideEndNote/frozen.js'
import { slideEndNoteHit } from './segments/slideEndNote/hit.js'
import { slideEndNoteIntro } from './segments/slideEndNote/intro.js'
import { slideStartNoteFall } from './segments/slideStartNote/fall.js'
import { slideStartNoteFrozen } from './segments/slideStartNote/frozen.js'
import { slideStartNoteHit } from './segments/slideStartNote/hit.js'
import { slideStartNoteIntro } from './segments/slideStartNote/intro.js'
import { tapNoteFall } from './segments/tapNote/fall.js'
import { tapNoteFrozen } from './segments/tapNote/frozen.js'
import { tapNoteHit } from './segments/tapNote/hit.js'
import { tapNoteIntro } from './segments/tapNote/intro.js'

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

    switch (segment.current % 4) {
        case 0:
            segment.time.end += 1
            break
        case 2:
            segment.time.end += 4
            break
        default:
            segment.time.end += 2
            break
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
