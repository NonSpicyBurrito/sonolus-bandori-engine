# Sonolus Bandori Engine

A recreation of BanG Dream! Girls Band Party engine in [Sonolus](https://sonolus.com).

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://github.com/NonSpicyBurrito/sonolus-wiki)

## Installation

```
npm install sonolus-bandori-engine --save
```

## Custom Resources

Engine ID: `1`

### Skin Sprites

| ID  | Sprite                         | Bandori Asset Path                                        |
| --- | ------------------------------ | --------------------------------------------------------- |
| 1   | Stage                          | `/ingameskin/fieldskin/{name}/bg_line_rhythm.png`         |
| 2   | Judgment Line                  | `/ingameskin/fieldskin/{name}/game_play_line.png`         |
| 11  | Left Directional Flick Note    | `/ingameskin/noteskin/{name}/DirectionalFlickSprites.png` |
| 12  | Right Directional Flick Note   | `/ingameskin/noteskin/{name}/DirectionalFlickSprites.png` |
| 21  | Left Directional Flick Marker  | `/ingameskin/noteskin/{name}/DirectionalFlickSprites.png` |
| 22  | Right Directional Flick Marker | `/ingameskin/noteskin/{name}/DirectionalFlickSprites.png` |

### Effect Clips

| ID  | Sprite                   | Bandori Asset Path                             |
| --- | ------------------------ | ---------------------------------------------- |
| 1   | Directional Flick Single | `/sound/tapseskin/{name}/directional_fl.mp3`   |
| 2   | Directional Flick Double | `/sound/tapseskin/{name}/directional_fl_2.mp3` |
| 3   | Directional Flick Triple | `/sound/tapseskin/{name}/directional_fl_3.mp3` |

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

### `engineData`

Engine Data.

-   `engineData.path`: path to file.
-   `engineData.buffer`: buffer of file.
-   `engineData.hash`: hash of file.

### `engineThumbnail`

Engine Thumbnail.

-   `engineThumbnail.path`: path to file.
-   `engineThumbnail.buffer`: buffer of file.
-   `engineThumbnail.hash`: hash of file.

### `fromBestdori(chart)`

Converts Bestdori chart to Level Data.

-   `chart`: Bestdori chart.
