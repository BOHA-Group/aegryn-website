/**
 * Hero de La Boutique : une seule vidéo plein cadre, qui change sur le tempo du
 * morceau « Beyond the Clicks » (analyse : 105,76 BPM, premier temps à 0,107 s, sans
 * dérive sur toute la piste, soit un temps = 0,57 s ; chaque clip dure 2 temps, soit 1,13 s). Les 26 clips horizontaux
 * suivent une journée type, du lac au soir, puis la séquence reboucle. Les clips
 * verticaux ne passent pas en hero : ils sont affichés dans le corps de la page.
 */
export const BOUTIQUE_TEMPO = {
  bpm: 105.76,
  firstBeat: 0.107,
  track: '/audio/ambient.mp3',
  /** 2 = une vidéo tous les deux temps (≈ 1,13 s) ; 1 = une vidéo à chaque temps (0,57 s) */
  beatsPerClip: 2,
} as const

export const BEAT_SECONDS = 60 / BOUTIQUE_TEMPO.bpm

/** Journée type : aube sur Genève, sport et café du matin, savoir-faire et travail,
    déplacements et loisirs l'après-midi, dîner le soir, événementiel et ville la nuit. */
export const HERO_CLIPS = [
  /* Matin */
  '01-geneva-fountain', '20-stretching', '18-espresso',
  /* Matinée : conception, ateliers, affaires */
  'architect-palette', 'watchmaker', 'jeweler', 'metal-grinding',
  'phone-scroll', '17-taking-notes', '22-conference',
  /* Après-midi : déplacements et loisirs */
  'jet-tarmac', '14-back-seat', 'resort-aerial', '16-gt-race', 'speedboat',
  '08-seine-sunset',
  /* Soir : détente, gastronomie et boissons */
  'wine-cellar', 'singing-bowl', 'dish-plating', 'restaurant-night', 'cocktail-bar',
  /* Nuit : production, événementiel, ville */
  'film-camera', '11-concert-flames', 'city-night-timelapse', 'bridge-dusk',
  /* Clôture emblématique */
  '09-statue-of-liberty',
] as const

/** Clips verticaux, affichés dans le corps de la page avec léger agrandissement au scroll */
export const PORTRAIT_CLIPS = ['portrait-rolls-royce', 'portrait-driver'] as const

export const TOTAL_BEATS = HERO_CLIPS.length * BOUTIQUE_TEMPO.beatsPerClip

/** Version allégée pour les petits écrans */
export const clipSrc = (name: string, small: boolean) => `/videos/boutique/${name}${small ? '-m' : ''}.mp4`
