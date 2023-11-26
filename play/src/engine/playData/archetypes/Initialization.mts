import { options } from '../../configuration/options.mjs'
import { flick } from '../flick.mjs'
import { particle } from '../particle.mjs'
import { scaledScreen } from '../scaledScreen.mjs'
import { skin } from '../skin.mjs'
import { archetypes } from './index.mjs'

export class Initialization extends Archetype {
    preprocess() {
        const targetAspectRatio = 1334 / 750
        const lowPosition = 0.82
        const highPosition = 0.78125

        const stage = {
            w: options.lockStageAspectRatio
                ? screen.aspectRatio > targetAspectRatio
                    ? ((screen.h * highPosition) / lowPosition) * targetAspectRatio
                    : screen.w
                : screen.w,
            h: options.lockStageAspectRatio
                ? screen.aspectRatio > targetAspectRatio
                    ? screen.h * highPosition
                    : (screen.w / targetAspectRatio) * lowPosition
                : screen.aspectRatio > targetAspectRatio
                  ? screen.h * highPosition
                  : screen.h * lowPosition,
        }

        const t = options.lockStageAspectRatio
            ? screen.aspectRatio > targetAspectRatio
                ? screen.t
                : (screen.w / targetAspectRatio) * 0.5
            : screen.t

        const b = t - stage.h

        const w = stage.w / 2 / 4.375

        scaledScreen.l = screen.l / w
        scaledScreen.r = screen.r / w
        scaledScreen.b = screen.b / (b - t)
        scaledScreen.t = screen.t / (b - t)

        scaledScreen.w = screen.w / w
        scaledScreen.h = screen.h / (b - t)

        scaledScreen.wToH = w / (t - b)

        flick.distance = stage.w

        const transform = Mat.identity.scale(w, b - t).translate(0, t)
        skin.transform.set(transform)
        particle.transform.set(transform)

        score.base.set({
            perfect: 1,
            great: 0.8,
            good: 0.5,
        })
        score.consecutive.great.set({
            multiplier: 0.01,
            step: 100,
            cap: 1000,
        })

        const gap = 0.05
        const uiRect = screen.rect.shrink(gap, gap)

        ui.menu.set({
            anchor: uiRect.rt,
            pivot: { x: 1, y: 1 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.menu.scale),
            rotation: 0,
            alpha: ui.configuration.menu.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: true,
        })

        ui.metric.primary.bar.set({
            anchor: uiRect.lt,
            pivot: { x: 0, y: 1 },
            size: new Vec(0.75, 0.15).mul(ui.configuration.metric.primary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.primary.alpha,
            horizontalAlign: HorizontalAlign.Left,
            background: true,
        })
        ui.metric.primary.value.set({
            anchor: uiRect.lt.add(
                new Vec(0.715, -0.035).mul(ui.configuration.metric.primary.scale),
            ),
            pivot: { x: 1, y: 1 },
            size: new Vec(0, 0.08).mul(ui.configuration.metric.primary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.primary.alpha,
            horizontalAlign: HorizontalAlign.Right,
            background: false,
        })

        ui.metric.secondary.bar.set({
            anchor: uiRect.rt
                .sub(new Vec(gap, 0))
                .sub(new Vec(0.15, 0).mul(ui.configuration.menu.scale)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0.55, 0.15).mul(ui.configuration.metric.secondary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.secondary.alpha,
            horizontalAlign: HorizontalAlign.Left,
            background: true,
        })
        ui.metric.secondary.value.set({
            anchor: uiRect.rt
                .sub(new Vec(gap, 0))
                .sub(new Vec(0.15, 0).mul(ui.configuration.menu.scale))
                .sub(new Vec(0.035, 0.035).mul(ui.configuration.metric.secondary.scale)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0, 0.08).mul(ui.configuration.metric.secondary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.secondary.alpha,
            horizontalAlign: HorizontalAlign.Right,
            background: false,
        })

        ui.combo.value.set({
            anchor: { x: stage.w * 0.35, y: Math.lerp(t, b, 0.5) },
            pivot: { x: 0.5, y: 0.5 },
            size: new Vec(0, stage.h * 0.12).mul(ui.configuration.combo.scale),
            rotation: 0,
            alpha: ui.configuration.combo.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })
        ui.combo.text.set({
            anchor: { x: stage.w * 0.35, y: Math.lerp(t, b, 0.5) },
            pivot: { x: 0.5, y: 2.75 },
            size: new Vec(0, stage.h * 0.05).mul(ui.configuration.combo.scale),
            rotation: 0,
            alpha: ui.configuration.combo.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })

        ui.judgment.set({
            anchor: { x: 0, y: Math.lerp(t, b, 0.87) },
            pivot: { x: 0.5, y: 0.5 },
            size: new Vec(0, stage.h * 0.075).mul(ui.configuration.judgment.scale),
            rotation: 0,
            alpha: ui.configuration.judgment.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })

        for (const archetype of Object.values(archetypes)) {
            if (!('globalPreprocess' in archetype)) continue

            archetype.globalPreprocess()
        }
    }

    spawnOrder() {
        return 0
    }

    updateSequential() {
        this.despawn = true
    }
}
