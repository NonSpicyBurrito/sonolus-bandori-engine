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

### `engineConfiguration`

Engine Configuration.

-   `engineConfiguration.path`: path to file.
-   `engineConfiguration.buffer`: buffer of file.
-   `engineConfiguration.hash`: hash of file.

### `enginePlayData`

Engine Play Data.

-   `enginePlayData.path`: path to file.
-   `enginePlayData.buffer`: buffer of file.
-   `enginePlayData.hash`: hash of file.

### `engineThumbnail`

Engine Thumbnail.

-   `engineThumbnail.path`: path to file.
-   `engineThumbnail.buffer`: buffer of file.
-   `engineThumbnail.hash`: hash of file.

### `bestdoriToLevelData(chart, offset?)`

Converts Bestdori chart to Level Data.

-   `chart`: Bestdori chart.
-   `offset`: offset (default: `0`).
