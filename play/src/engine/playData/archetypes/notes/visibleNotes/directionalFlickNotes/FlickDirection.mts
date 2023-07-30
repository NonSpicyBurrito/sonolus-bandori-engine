export const FlickDirection = {
    Left: -1,
    Right: 1,
} as const

export type FlickDirection = (typeof FlickDirection)[keyof typeof FlickDirection]
