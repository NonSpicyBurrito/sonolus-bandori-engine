import { defineConfig } from 'oxfmt'

export default defineConfig({
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    sortImports: {},
    ignorePatterns: [
        '**/*.*',

        '!oxfmt.config.ts',
        '!oxlint.config.ts',
        '!README.md',

        '!lib/build.js',
        '!lib/src/**/*.*',

        '!shared/src/**/*.*',

        '!play/sonolus-cli.config.js',
        '!play/src/**/*.*',

        '!watch/sonolus-cli.config.js',
        '!watch/src/**/*.*',

        '!preview/sonolus-cli.config.js',
        '!preview/src/**/*.*',

        '!tutorial/sonolus-cli.config.js',
        '!tutorial/src/**/*.*',
    ],
})
