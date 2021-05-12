import {
    Add,
    And,
    ArchetypeLife,
    ConsecutiveGreatScore,
    GoodMultiplier,
    GreatMultiplier,
    HorizontalAlign,
    If,
    LevelBucket,
    Multiply,
    PerfectMultiplier,
    Spawn,
    SScript,
    Subtract,
    UIComboText,
    UIComboValue,
    UIJudgment,
    UILifeBar,
    UILifeValue,
    UIMenu,
    UIScoreBar,
    UIScoreValue,
    VerticalAlign,
} from 'sonolus.js'

import { options } from '../../configuration/options'
import { archetypes } from '../archetypes'
import { buckets } from '../buckets'
import { scripts } from '.'
import { screenLeft, screenRight, stageHeight } from './common/constants'

export function initialization(): SScript {
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
        preprocess: {
            code: preprocess,
        },
        spawnOrder: {
            code: spawnOrder,
        },
        updateSequential: {
            code: updateSequential,
        },
    }

    function setupUI() {
        return [
            UIMenu.set(
                Subtract(screenRight, 0.05),
                0.95,
                1,
                1,
                0.15,
                0.15,
                0,
                1,
                HorizontalAlign.Center,
                VerticalAlign.Middle,
                true
            ),

            UIScoreBar.set(
                Add(screenLeft, 0.05),
                0.95,
                0,
                1,
                0.75,
                0.15,
                0,
                1,
                HorizontalAlign.Left,
                VerticalAlign.Middle,
                true
            ),
            UIScoreValue.set(
                Add(screenLeft, 0.2),
                0.95,
                0,
                1,
                0.6,
                0.15,
                0,
                1,
                HorizontalAlign.Right,
                VerticalAlign.Middle,
                false
            ),

            UILifeBar.set(
                Subtract(screenRight, 0.25),
                0.95,
                1,
                1,
                0.55,
                0.15,
                0,
                1,
                HorizontalAlign.Left,
                VerticalAlign.Middle,
                true
            ),
            UILifeValue.set(
                Subtract(screenRight, 0.25),
                0.95,
                1,
                1,
                0.4,
                0.15,
                0,
                1,
                HorizontalAlign.Right,
                VerticalAlign.Middle,
                false
            ),

            UIJudgment.set(
                0,
                Multiply(stageHeight, -0.25),
                0.5,
                0,
                Multiply(0.8, options.uiJudgmentSize),
                Multiply(0.2, options.uiJudgmentSize),
                0,
                options.uiJudgmentAlpha,
                HorizontalAlign.Center,
                VerticalAlign.Middle,
                false
            ),

            UIComboValue.set(
                Multiply(screenRight, 0.7),
                0,
                0.5,
                0,
                Multiply(0.5, options.uiComboSize),
                Multiply(0.25, options.uiComboSize),
                0,
                options.uiComboAlpha,
                HorizontalAlign.Center,
                VerticalAlign.Middle,
                false
            ),
            UIComboText.set(
                Multiply(screenRight, 0.7),
                0,
                0.5,
                1,
                Multiply(0.5, options.uiComboSize),
                Multiply(0.15, options.uiComboSize),
                0,
                options.uiComboAlpha,
                HorizontalAlign.Center,
                VerticalAlign.Middle,
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
