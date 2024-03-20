# Sonolus Bandori Engine

A recreation of BanG Dream! Girls Band Party engine in [Sonolus](https://sonolus.com).

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://github.com/NonSpicyBurrito/sonolus-wiki)

## Installation

```
npm install sonolus-bandori-engine
```

## Custom Resources

### Skin Sprites

| Name                                     | Bandori Asset Path                                    |
| ---------------------------------------- | ----------------------------------------------------- |
| `Bandori Stage`                          | `/ingameskin/fieldskin/{name}/bg_line_rhythm`         |
| `Bandori Judgment Line`                  | `/ingameskin/fieldskin/{name}/game_play_line`         |
| `Bandori Directional Flick Note Left`    | `/ingameskin/noteskin/{name}/DirectionalFlickSprites` |
| `Bandori Directional Flick Note Right`   | `/ingameskin/noteskin/{name}/DirectionalFlickSprites` |
| `Bandori Directional Flick Marker Left`  | `/ingameskin/noteskin/{name}/DirectionalFlickSprites` |
| `Bandori Directional Flick Marker Right` | `/ingameskin/noteskin/{name}/DirectionalFlickSprites` |

### Effect Clips

| Name                               | Bandori Asset Path                         |
| ---------------------------------- | ------------------------------------------ |
| `Bandori Directional Flick Single` | `/sound/tapseskin/{name}/directional_fl`   |
| `Bandori Directional Flick Double` | `/sound/tapseskin/{name}/directional_fl_2` |
| `Bandori Directional Flick Triple` | `/sound/tapseskin/{name}/directional_fl_3` |

### Particle Effects

| Name                                       |
| ------------------------------------------ |
| `Bandori Circular Directional Flick Left`  |
| `Bandori Linear Directional Flick Left`    |
| `Bandori Circular Directional Flick Right` |
| `Bandori Linear Directional Flick Right`   |

## Documentation

### `version`

Package version.

### `engineInfo`

Partial engine information compatible with [sonolus-express](https://github.com/NonSpicyBurrito/sonolus-express).

### `engineConfigurationPath`

Path to Engine Configuration file.

### `enginePlayDataPath`

Path to Engine Play Data file.

### `engineWatchDataPath`

Path to Engine Watch Data file.

### `enginePreviewDataPath`

Path to Engine Preview Data file.

### `engineTutorialDataPath`

Path to Engine Tutorial Data file.

### `engineThumbnailPath`

Path to Engine Thumbnail file.

### `bestdoriToLevelData(chart, offset?)`

Converts Bestdori chart to Level Data.

-   `chart`: Bestdori chart.
-   `offset`: offset (default: `0`).
