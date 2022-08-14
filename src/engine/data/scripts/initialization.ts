import {
    Add,
    And,
    ArchetypeLife,
    ConsecutiveGreatScore,
    GoodMultiplier,
    GreatMultiplier,
    HorizontalAlign,
    If,
    Lerp,
    LevelBucket,
    Multiply,
    PerfectMultiplier,
    Script,
    Spawn,
    Subtract,
    UIComboConfiguration,
    UIComboText,
    UIComboValue,
    UIJudgment,
    UIJudgmentConfiguration,
    UIMenu,
    UIMenuConfiguration,
    UIPrimaryMetricBar,
    UIPrimaryMetricConfiguration,
    UIPrimaryMetricValue,
    UISecondaryMetricBar,
    UISecondaryMetricConfiguration,
    UISecondaryMetricValue,
} from 'sonolus.js'
import { scripts } from '.'
import { options } from '../../configuration/options'
import { archetypes } from '../archetypes'
import { buckets } from '../buckets'
import {
    screenLeft,
    screenRight,
    stageBottom,
    stageHeight,
    stageTop,
    stageWidth,
} from './common/constants'

export function initialization(): Script {
    const preprocess = [setupUI(), setupBuckets(), setupScore(), setupLife()]

    const spawnOrder = -1000

    const updateSequential = [
        And(
            options.isAutoplay,
            options.isSFXEnabled,
            Spawn(scripts.autoSFXIndex, [])
        ),
        true,
    ]

    return {
        preprocess,
        spawnOrder,
        updateSequential,
    }

    function setupUI() {
        return [
            UIMenu.set(
                Subtract(screenRight, 0.05),
                0.95,
                1,
                1,
                Multiply(0.15, UIMenuConfiguration.scale),
                Multiply(0.15, UIMenuConfiguration.scale),
                0,
                UIMenuConfiguration.alpha,
                HorizontalAlign.Center,
                true
            ),

            UIPrimaryMetricBar.set(
                Add(screenLeft, 0.05),
                0.95,
                0,
                1,
                Multiply(0.75, UIPrimaryMetricConfiguration.scale),
                Multiply(0.15, UIPrimaryMetricConfiguration.scale),
                0,
                UIPrimaryMetricConfiguration.alpha,
                HorizontalAlign.Left,
                true
            ),
            UIPrimaryMetricValue.set(
                Add(
                    screenLeft,
                    0.05,
                    Multiply(0.715, UIPrimaryMetricConfiguration.scale)
                ),
                Subtract(
                    0.95,
                    Multiply(0.035, UIPrimaryMetricConfiguration.scale)
                ),
                1,
                1,
                0,
                Multiply(0.08, UIPrimaryMetricConfiguration.scale),
                0,
                UIPrimaryMetricConfiguration.alpha,
                HorizontalAlign.Right,
                false
            ),

            UISecondaryMetricBar.set(
                Subtract(
                    screenRight,
                    0.1,
                    Multiply(0.15, UIMenuConfiguration.scale)
                ),
                0.95,
                1,
                1,
                Multiply(0.55, UISecondaryMetricConfiguration.scale),
                Multiply(0.15, UISecondaryMetricConfiguration.scale),
                0,
                UISecondaryMetricConfiguration.alpha,
                HorizontalAlign.Left,
                true
            ),
            UISecondaryMetricValue.set(
                Subtract(
                    screenRight,
                    0.1,
                    Multiply(0.15, UIMenuConfiguration.scale),
                    Multiply(0.035, UISecondaryMetricConfiguration.scale)
                ),
                Subtract(
                    0.95,
                    Multiply(0.035, UISecondaryMetricConfiguration.scale)
                ),
                1,
                1,
                0,
                Multiply(0.08, UISecondaryMetricConfiguration.scale),
                0,
                UISecondaryMetricConfiguration.alpha,
                HorizontalAlign.Right,
                false
            ),

            UIJudgment.set(
                0,
                Lerp(stageTop, stageBottom, 0.87),
                0.5,
                0.5,
                0,
                Multiply(stageHeight, 0.075, UIJudgmentConfiguration.scale),
                0,
                UIJudgmentConfiguration.alpha,
                HorizontalAlign.Center,
                false
            ),

            UIComboValue.set(
                Multiply(stageWidth, 0.35),
                Lerp(stageTop, stageBottom, 0.5),
                0.5,
                0.5,
                0,
                Multiply(stageHeight, 0.12, UIComboConfiguration.scale),
                0,
                UIComboConfiguration.alpha,
                HorizontalAlign.Center,
                false
            ),
            UIComboText.set(
                Multiply(stageWidth, 0.35),
                Lerp(stageTop, stageBottom, 0.5),
                0.5,
                2.75,
                0,
                Multiply(stageHeight, 0.05, UIComboConfiguration.scale),
                0,
                UIComboConfiguration.alpha,
                HorizontalAlign.Center,
                false
            ),
        ]
    }

    function setupBuckets() {
        return [
            LevelBucket.of(buckets.tapNoteIndex).setBucket(50, 100, 150),
            LevelBucket.of(buckets.flickNoteIndex).setBucket(50, 100, 150),
            LevelBucket.of(buckets.leftDirectionalFlickNoteIndex).setBucket(
                50,
                100,
                150
            ),
            LevelBucket.of(buckets.rightDirectionalFlickNoteIndex).setBucket(
                50,
                100,
                150
            ),
            LevelBucket.of(buckets.slideStartNoteIndex).setBucket(50, 100, 150),
            If(
                options.isStrictJudgment,
                [
                    LevelBucket.of(buckets.slideTickNoteIndex).setBucket(
                        0,
                        50,
                        0,
                        100,
                        0,
                        150
                    ),
                    LevelBucket.of(buckets.slideEndNoteIndex).setBucket(
                        50,
                        100,
                        150
                    ),
                    LevelBucket.of(buckets.slideFlickNoteIndex).setBucket(
                        50,
                        100,
                        150
                    ),
                ],
                [
                    LevelBucket.of(buckets.slideTickNoteIndex).setBucket(
                        0,
                        200,
                        0,
                        200,
                        0,
                        200
                    ),
                    LevelBucket.of(buckets.slideEndNoteIndex).setBucket(
                        -50,
                        200,
                        -100,
                        200,
                        -150,
                        200
                    ),
                    LevelBucket.of(buckets.slideFlickNoteIndex).setBucket(
                        -50,
                        200,
                        -100,
                        200,
                        -150,
                        200
                    ),
                ]
            ),
        ]
    }

    function setupScore() {
        return [
            PerfectMultiplier.set(1),
            GreatMultiplier.set(0.8),
            GoodMultiplier.set(0.5),

            ConsecutiveGreatScore.set(0.01, 100, 1000),
        ]
    }

    function setupLife() {
        return [
            ArchetypeLife.of(archetypes.tapNoteIndex).missLifeIncrement.set(
                -100
            ),
            ArchetypeLife.of(archetypes.flickNoteIndex).missLifeIncrement.set(
                -100
            ),
            ArchetypeLife.of(
                archetypes.directionalFlickNoteIndex
            ).missLifeIncrement.set(-100),
            ArchetypeLife.of(
                archetypes.slideStartNoteIndex
            ).missLifeIncrement.set(-100),
            ArchetypeLife.of(
                archetypes.slideTickNoteIndex
            ).missLifeIncrement.set(-20),
            ArchetypeLife.of(
                archetypes.slideEndNoteIndex
            ).missLifeIncrement.set(-100),
            ArchetypeLife.of(
                archetypes.slideFlickNoteIndex
            ).missLifeIncrement.set(-100),
        ]
    }
}
