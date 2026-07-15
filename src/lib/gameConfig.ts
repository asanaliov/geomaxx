/**
 * Zoom level shown after each wrong guess. Index 0 is the starting view and
 * later indices progressively reveal more detail around the landmark.
 */
export const ZOOM_LEVELS = [7, 9, 11, 13, 15, 17] as const

export const MAX_GUESSES = ZOOM_LEVELS.length
export const STATS_BUCKETS = MAX_GUESSES + 1
