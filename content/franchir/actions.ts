/**
 * Actions de contact du bloc FRANCHIR (/franchir/*).
 * Chaque page cycle pointe vers /contact?cycle=<slug>&action=echange,
 * la page Restructuration ajoute action=urgence. La page d'introduction
 * (/valoriser) pointe vers /contact?action=echange (cycle "general").
 * Les parametres cycle/action sont des identifiants stables (non traduits).
 */

import type { ActionDef } from '@/content/advisory/actions'
import type { CycleSlug } from './types'

export type CycleActionSlug = 'echange' | 'urgence'

type Key = `${CycleSlug | 'general'}:${CycleActionSlug}`

export const CYCLE_ACTIONS: Record<string, Partial<Record<Key, ActionDef>>> = {
  fr: {
    'general:echange':        { label: 'Échanger 30 minutes', question: 'Quel cycle traversez-vous, et quel sujet souhaitez-vous poser ?', questionType: 'text' },
    'lancement:echange':      { label: 'Échanger 30 minutes', question: 'Que lancez-vous, et quelle décision doit être prise en premier ?', questionType: 'text' },
    'croissance:echange':     { label: 'Échanger 30 minutes', question: 'Qu’est-ce qui ralentit votre croissance aujourd’hui ?', questionType: 'text' },
    'restructuration:echange': { label: 'Échanger 30 minutes', question: 'Quel événement déclenche le besoin, et depuis quand ?', questionType: 'text' },
    'restructuration:urgence': { label: "Situation d'urgence : contact direct", question: 'Décrivez la situation en quelques lignes : événement, échéance, décision à prendre.', questionType: 'text' },
    'acquisition:echange':    { label: 'Échanger 30 minutes', question: 'Cible repérée, en discussion ou intégration en cours ?', questionType: 'text' },
    'transmission:echange':   { label: 'Échanger 30 minutes', question: 'Quel horizon de transmission envisagez-vous ?', questionType: 'text' },
  },
  en: {
    'general:echange':        { label: '30-minute call', question: 'Which stage are you in, and what would you like to raise?', questionType: 'text' },
    'lancement:echange':      { label: '30-minute call', question: 'What are you launching, and which decision comes first?', questionType: 'text' },
    'croissance:echange':     { label: '30-minute call', question: 'What is slowing your growth today?', questionType: 'text' },
    'restructuration:echange': { label: '30-minute call', question: 'Which event triggered the need, and when?', questionType: 'text' },
    'restructuration:urgence': { label: 'Urgent situation: direct contact', question: 'Describe the situation in a few lines: event, deadline, decision to make.', questionType: 'text' },
    'acquisition:echange':    { label: '30-minute call', question: 'Target identified, in discussion or integration under way?', questionType: 'text' },
    'transmission:echange':   { label: '30-minute call', question: 'What transfer horizon are you considering?', questionType: 'text' },
  },
  de: {
    'general:echange':        { label: '30 Minuten austauschen', question: 'In welchem Zyklus befinden Sie sich, und welches Thema möchten Sie ansprechen?', questionType: 'text' },
    'lancement:echange':      { label: '30 Minuten austauschen', question: 'Was starten Sie, und welche Entscheidung steht zuerst an?', questionType: 'text' },
    'croissance:echange':     { label: '30 Minuten austauschen', question: 'Was bremst Ihr Wachstum heute?', questionType: 'text' },
    'restructuration:echange': { label: '30 Minuten austauschen', question: 'Welches Ereignis hat den Bedarf ausgelöst, und wann?', questionType: 'text' },
    'restructuration:urgence': { label: 'Notlage: direkter Kontakt', question: 'Beschreiben Sie die Lage in wenigen Zeilen: Ereignis, Frist, zu treffende Entscheidung.', questionType: 'text' },
    'acquisition:echange':    { label: '30 Minuten austauschen', question: 'Ziel identifiziert, im Gespräch oder Integration im Gange?', questionType: 'text' },
    'transmission:echange':   { label: '30 Minuten austauschen', question: 'Welchen Übergabehorizont ziehen Sie in Betracht?', questionType: 'text' },
  },
  it: {
    'general:echange':        { label: 'Scambiare 30 minuti', question: 'In quale ciclo vi trovate, e quale tema volete porre?', questionType: 'text' },
    'lancement:echange':      { label: 'Scambiare 30 minuti', question: 'Cosa state lanciando, e quale decisione va presa per prima?', questionType: 'text' },
    'croissance:echange':     { label: 'Scambiare 30 minuti', question: 'Cosa rallenta la vostra crescita oggi?', questionType: 'text' },
    'restructuration:echange': { label: 'Scambiare 30 minuti', question: 'Quale evento ha innescato il bisogno, e da quando?', questionType: 'text' },
    'restructuration:urgence': { label: 'Situazione urgente: contatto diretto', question: 'Descrivete la situazione in poche righe: evento, scadenza, decisione da prendere.', questionType: 'text' },
    'acquisition:echange':    { label: 'Scambiare 30 minuti', question: 'Target individuato, in discussione o integrazione in corso?', questionType: 'text' },
    'transmission:echange':   { label: 'Scambiare 30 minuti', question: 'Quale orizzonte di trasmissione considerate?', questionType: 'text' },
  },
  es: {
    'general:echange':        { label: 'Intercambiar 30 minutos', question: '¿En qué ciclo se encuentra, y qué tema quiere plantear?', questionType: 'text' },
    'lancement:echange':      { label: 'Intercambiar 30 minutos', question: '¿Qué está lanzando, y qué decisión debe tomarse primero?', questionType: 'text' },
    'croissance:echange':     { label: 'Intercambiar 30 minutos', question: '¿Qué frena su crecimiento hoy?', questionType: 'text' },
    'restructuration:echange': { label: 'Intercambiar 30 minutos', question: '¿Qué evento desencadena la necesidad, y desde cuándo?', questionType: 'text' },
    'restructuration:urgence': { label: 'Situación urgente: contacto directo', question: 'Describa la situación en pocas líneas: evento, plazo, decisión a tomar.', questionType: 'text' },
    'acquisition:echange':    { label: 'Intercambiar 30 minutos', question: '¿Objetivo identificado, en conversaciones o integración en curso?', questionType: 'text' },
    'transmission:echange':   { label: 'Intercambiar 30 minutos', question: '¿Qué horizonte de transmisión considera?', questionType: 'text' },
  },
  nl: {
    'general:echange':        { label: '30 minuten spreken', question: 'In welk traject zit u, en welk onderwerp wilt u bespreken?', questionType: 'text' },
    'lancement:echange':      { label: '30 minuten spreken', question: 'Wat lanceert u, en welke beslissing komt eerst?', questionType: 'text' },
    'croissance:echange':     { label: '30 minuten spreken', question: 'Wat remt uw groei vandaag?', questionType: 'text' },
    'restructuration:echange': { label: '30 minuten spreken', question: 'Welke gebeurtenis heeft de behoefte veroorzaakt, en sinds wanneer?', questionType: 'text' },
    'restructuration:urgence': { label: 'Spoedgeval: direct contact', question: 'Beschrijf de situatie in enkele regels: gebeurtenis, deadline, te nemen beslissing.', questionType: 'text' },
    'acquisition:echange':    { label: '30 minuten spreken', question: 'Doelwit geïdentificeerd, in gesprek of integratie loopt?', questionType: 'text' },
    'transmission:echange':   { label: '30 minuten spreken', question: 'Welke overdrachtshorizon overweegt u?', questionType: 'text' },
  },
}

export function getCycleAction(locale: string, cycle: string, action: string): ActionDef | null {
  const dict = CYCLE_ACTIONS[locale] ?? CYCLE_ACTIONS.fr
  return dict[`${cycle}:${action}` as Key] ?? CYCLE_ACTIONS.fr[`${cycle}:${action}` as Key] ?? null
}
