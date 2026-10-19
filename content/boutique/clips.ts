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
export const BOUTIQUE_INTRO_SECONDS = 4
/** First full bass hit, after the track's 16-beat instrumental opening. */
export const BOUTIQUE_FIRST_BASS = BOUTIQUE_TEMPO.firstBeat + 16 * BEAT_SECONDS
export const BOUTIQUE_AUDIO_START = BOUTIQUE_FIRST_BASS - BOUTIQUE_INTRO_SECONDS

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
  'wine-cellar', 'singing-bowl', 'restaurant-night', 'dish-plating', 'cocktail-bar',
  /* Nuit : production, événementiel, ville */
  'film-camera', '11-concert-flames', 'city-night-timelapse', 'bridge-dusk',
  /* Clôture emblématique : source de 10 s (5 s puis retour arrière) pour couvrir tout
     le créneau élastique, 5 à 7 s selon la langue, sans ralenti ni raccord visible */
  'statue-of-liberty-loop',
] as const

/** Temps par clip : tous coupent sur deux temps (1,13 s, lus à vitesse normale dans des
    sources de 1,4 s). Le dernier clip est élastique : il tient jusqu'à la fin du cycle
    complet des titres dactylographiés, puis titres et vidéos rebouclent ensemble.
    Sa valeur ci-dessous sert d'estimation pour le zoom, pas de durée fixe. */
export const CLIP_BEATS: Record<string, number> = {
  'statue-of-liberty-loop': 10,
}
export const clipBeats = (name: string) => CLIP_BEATS[name] ?? BOUTIQUE_TEMPO.beatsPerClip
/** Temps de début de chaque clip dans le cycle ; le début du dernier marque la fin de la partie fixe. */
export const CLIP_START_BEATS = (() => { let a = 0; return HERO_CLIPS.map(n => { const s = a; a += clipBeats(n); return s }) })()

/** Clips verticaux, affichés dans le corps de la page avec léger agrandissement au scroll */
export const PORTRAIT_CLIPS = ['portrait-rolls-royce', 'portrait-driver'] as const

export const TOTAL_BEATS = HERO_CLIPS.reduce((s, n) => s + clipBeats(n), 0)

/** Paliers de qualité : 0 = `-s` 360p (~0,5 Mbps, réseau faible), 1 = `-m` 540p (~1 Mbps),
    2 = `-hq` 720p sur mobile, 1080p d'origine sur bureau. Par défaut : `-m` mobile, 1080p bureau. */
export const clipSrc = (name: string, small: boolean, quality = small ? 1 : 2) =>
  `/videos/boutique/${name}${(small ? ['-s', '-m', '-hq'] : ['-s', '-m', ''])[quality]}.mp4`
