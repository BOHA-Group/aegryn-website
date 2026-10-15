/**
 * Hero de La Boutique : une seule vidéo plein cadre, qui change sur le tempo du
 * morceau « Beyond the Clicks » (analyse : 105,76 BPM, premier temps à 0,107 s, sans
 * dérive sur toute la piste, soit un temps = 0,57 s ; chaque clip dure 2 temps, soit 1,13 s). Les 20 clips horizontaux
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

/** Journée type : lac, voyage, destinations, déjeuner, détente, soirée, route, travail, sport, rencontre */
export const HERO_CLIPS = [
  '01-geneva-fountain', '02-private-jet', '03-burj-al-arab', '04-galeries-lafayette', '05-chef',
  '06-resort-pool', '07-beach', '08-seine-sunset', '09-statue-of-liberty', '10-concert', '11-rave',
  '14-back-seat', '15-phone-call', '16-gt-race',
  '17-taking-notes', '18-espresso', '19-team-work', '20-stretching', '21-leg-exercises', '22-conference',
] as const

/** Clips verticaux, affichés dans le corps de la page avec léger agrandissement au scroll */
export const PORTRAIT_CLIPS = ['portrait-rolls-royce', 'portrait-driver'] as const

export const TOTAL_BEATS = HERO_CLIPS.length * BOUTIQUE_TEMPO.beatsPerClip

/** Version allégée pour les petits écrans */
export const clipSrc = (name: string, small: boolean) => `/videos/boutique/${name}${small ? '-m' : ''}.mp4`
