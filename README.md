# Sonolus Bandori Engine

A recreation of BanG Dream! Girls Band Party engine in [Sonolus](https://sonolus.com).

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://github.com/NonSpicyBurrito/sonolus-wiki)

## Installation

```
npm install sonolus-bandori-engine --save
```

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
