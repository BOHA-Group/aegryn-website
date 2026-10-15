/**
 * Hero de La Boutique : patchwork de vidéos calé sur le tempo du morceau
 * « Beyond the Clicks » (analyse : 105,76 BPM, premier temps à 0,107 s, sans dérive
 * sur toute la piste). Les 22 clips suivent une journée type, du lac au soir.
 *
 * Une scène affiche 1, 2 ou 3 volets. Chaque volet dure 2 temps (≈ 1,13 s), donc :
 * 1 visuel = 2 temps, 2 visuels = 4 temps (≈ 2,27 s), 3 visuels = 6 temps (≈ 3,40 s),
 * soit un nouveau visuel environ chaque seconde. Toutes les vidéos se déroulent une
 * fois, puis la séquence boucle.
 */
export const BOUTIQUE_TEMPO = {
  bpm: 105.76,
  firstBeat: 0.107,
  track: '/audio/ambient.mp3',
  beatsPerPanel: 2,
} as const

export const BEAT_SECONDS = 60 / BOUTIQUE_TEMPO.bpm

/** Journée type : lac, voyage, destinations, déjeuner, détente, soirée, route, travail, sport, rencontre */
export const BOUTIQUE_CLIPS = [
  '01-geneva-fountain', '02-private-jet', '03-burj-al-arab', '04-galeries-lafayette', '05-chef',
  '06-resort-pool', '07-beach', '08-seine-sunset', '09-statue-of-liberty', '10-concert', '11-rave',
  '12-rolls-royce', '13-driver', '14-back-seat', '15-phone-call', '16-gt-race',
  '17-taking-notes', '18-espresso', '19-team-work', '20-stretching', '21-leg-exercises', '22-conference',
] as const

/** Nombre de volets par scène (somme = 22 clips) */
export const SCENE_PATTERN = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 3] as const

/** Gabarits de volets en % du hero : [x, y, largeur, hauteur] */
export const LAYOUTS: Record<number, [number, number, number, number][][]> = {
  1: [[[0, 0, 100, 100]]],
  2: [
    [[0, 0, 50, 100], [50, 0, 50, 100]],
    [[0, 0, 62, 100], [62, 0, 38, 100]],
  ],
  3: [
    [[0, 0, 33.34, 100], [33.34, 0, 33.33, 100], [66.67, 0, 33.33, 100]],
    [[0, 0, 60, 100], [60, 0, 40, 50], [60, 50, 40, 50]],
  ],
}

export interface Scene { index: number; clips: number[]; startBeat: number; beats: number; rects: [number, number, number, number][] }

export const SCENES: Scene[] = (() => {
  const out: Scene[] = []
  const seen: Record<number, number> = {}
  let clip = 0, beat = 0
  SCENE_PATTERN.forEach((n, index) => {
    const variants = LAYOUTS[n]
    const k = seen[n] = (seen[n] ?? -1) + 1
    const beats = n * BOUTIQUE_TEMPO.beatsPerPanel
    out.push({ index, clips: Array.from({ length: n }, (_, i) => clip + i), startBeat: beat, beats, rects: variants[k % variants.length] })
    clip += n; beat += beats
  })
  return out
})()

export const TOTAL_BEATS = SCENES.reduce((s, sc) => s + sc.beats, 0)
