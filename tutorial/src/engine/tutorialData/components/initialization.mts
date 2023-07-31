import { particle } from '../particle.mjs'
import { hand, scaledScreen } from '../shared.mjs'
import { skin } from '../skin.mjs'

export const initialization = {
    preprocess() {
        const targetAspectRatio = 1334 / 750
        const lowPosition = 0.82
        const highPosition = 0.78125

        const stage = {
            w:
                screen.aspectRatio > targetAspectRatio
                    ? ((screen.h * highPosition) / lowPosition) * targetAspectRatio
                    : screen.w,
            h:
                screen.aspectRatio > targetAspectRatio
                    ? screen.h * highPosition
                    : (screen.w / targetAspectRatio) * lowPosition,
        }

        const t =
            screen.aspectRatio > targetAspectRatio ? screen.t : (screen.w / targetAspectRatio) * 0.5

        const b = t - stage.h

        const w = stage.w / 2 / 4.375

        scaledScreen.l = screen.l / w
        scaledScreen.r = screen.r / w
        scaledScreen.b = screen.b / (b - t)
        scaledScreen.t = screen.t / (b - t)

        scaledScreen.w = screen.w / w
        scaledScreen.h = screen.h / (b - t)

        scaledScreen.wToH = w / (t - b)

        new Vec(0, -1)
            .rotate(Math.PI / 3)
            .mul(0.25 * ui.configuration.instruction.scale)
            .translate(0, b)
            .copyTo(hand.position)

        const transform = Mat.identity.scale(w, b - t).translate(0, t)
        skin.transform.set(transform)
        particle.transform.set(transform)

        const gap = 0.05
        const uiRect = new Rect({
            l: screen.l + gap,
            r: screen.r - gap,
            b: screen.b + gap,
            t: screen.t - gap,
        })

        ui.menu.set({
            anchor: uiRect.rt,
            pivot: { x: 1, y: 1 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.menu.scale),
            rotation: 0,
            alpha: ui.configuration.menu.alpha,
            background: true,
        })

        ui.navigation.previous.set({
            anchor: { x: uiRect.l, y: 0 },
            pivot: { x: 0, y: 0.5 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.navigation.scale),
            rotation: 0,
            alpha: ui.configuration.navigation.alpha,
            background: true,
        })
        ui.navigation.next.set({
            anchor: { x: uiRect.r, y: 0 },
            pivot: { x: 1, y: 0.5 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.navigation.scale),
            rotation: 0,
            alpha: ui.configuration.navigation.alpha,
            background: true,
        })

        ui.instruction.set({
            anchor: Vec.zero,
            pivot: { x: 0.5, y: 0.5 },
            size: new Vec(1.2, 0.15).mul(ui.configuration.instruction.scale),
            rotation: 0,
            alpha: ui.configuration.instruction.alpha,
            background: true,
        })
    },
}
