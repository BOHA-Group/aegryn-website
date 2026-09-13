/**
 * lib/certificationWorkflow.ts — Parcours guidé d'un dossier (certification ou transaction)
 *
 * Calcule, côté serveur, l'état de chaque étape du workflow pour l'afficher sous forme de
 * bandeau étape par étape à l'admin, au client et à l'expert mandaté. Une seule source de
 * vérité pour « où en est le dossier et que faut-il faire maintenant ».
 */
import { createServiceClient } from '@/lib/supabase'
import type { Prescore } from '@/lib/prescore'

export type StepState = 'done' | 'current' | 'todo' | 'blocked'
export interface WorkflowStep {
  key:    string
  label:  string
  desc:   string
  state:  StepState
  /** Lien d'action pour le rôle affiché */
  href?:  string
  cta?:   string
}
export interface WorkflowProgress {
  steps:        WorkflowStep[]
  currentIndex: number
  dossierType:  'certification' | 'transaction'
}

type Role = 'admin' | 'client' | 'expert'

export async function getCertificationProgress(assetId: string, role: Role, opts?: { expertCertId?: string }): Promise<WorkflowProgress | null> {
  const supa = createServiceClient()
  const { data: a } = await supa
    .from('assets')
    .select('id, status, dossier_type, seller_uid, seller_email, prescore_json, aeg_grade, published_at, verification_code')
    .eq('id', assetId).maybeSingle()
  if (!a) return null

  const [{ data: prof }, { data: assessments }, { data: experts }] = await Promise.all([
    a.seller_uid
      ? supa.from('profiles').select('kyc_status').eq('id', a.seller_uid).maybeSingle()
      : supa.from('profiles').select('kyc_status').eq('email', a.seller_email ?? '').maybeSingle(),
    supa.from('grade_assessments').select('status').eq('asset_id', assetId),
    supa.from('partner_certifications').select('id, status, dimension').eq('asset_id', assetId),
  ])

  const kycOk      = prof?.kyc_status === 'approved'
  const kycStarted = !!prof?.kyc_status && prof.kyc_status !== 'pending'
  const prescore   = (a.prescore_json as Prescore | null) ?? null
  const docsOk     = prescore?.canGrade === true
  const docsSome   = (prescore?.dimensions ?? []).some(d => d.blockingOk + d.blockingPending > 0)
  const statuses   = (assessments ?? []).map(x => x.status)
  const computed   = statuses.length > 0
  const validated  = statuses.includes('validated') || statuses.includes('published') || statuses.includes('superseded')
  const published  = statuses.includes('published') || ['graded', 'published', 'sold'].includes(a.status ?? '')
  const expertsAll = experts ?? []
  const expertsPending = expertsAll.filter(e => ['assigned', 'in_review'].includes(e.status)).length
  const dossierType = (a.dossier_type as 'certification' | 'transaction') ?? 'transaction'

  const adminBase  = `/admin/assets/${assetId}`
  const clientBase = `/client/seller/actifs/${assetId}`

  let steps: WorkflowStep[]

  if (role === 'expert') {
    const mine = expertsAll.find(e => e.id === opts?.expertCertId)
    const accepted  = !!mine && mine.status !== 'assigned'
    const submitted = !!mine && ['submitted', 'validated'].includes(mine.status)
    const validatedByAegryn = !!mine && mine.status === 'validated'
    steps = [
      { key: 'mandate', label: 'Mandat', desc: 'Accepter le mandat sur votre dimension. Périmètre limité, confidentialité partenaire.', state: accepted ? 'done' : 'current' },
      { key: 'docs',    label: 'Pièces', desc: 'Consulter les pièces de votre dimension dans la Data Room. Aucun document transmis par email.', state: submitted ? 'done' : accepted ? 'current' : 'todo' },
      { key: 'score',   label: 'Scoring', desc: 'Attribuer un score sur 20, cocher les sous-codes CIFSO, formuler avis et réserves.', state: submitted ? 'done' : accepted ? 'current' : 'todo' },
      { key: 'review',  label: 'Revue Aegryn', desc: 'Aegryn intègre votre co-signature dans le moteur de grade et valide.', state: validatedByAegryn ? 'done' : submitted ? 'current' : 'todo' },
    ]
  } else {
    const isAdmin = role === 'admin'
    steps = [
      {
        key: 'request', label: dossierType === 'certification' ? 'Demande' : 'Soumission',
        desc: isAdmin ? 'Pré-qualification sous 5 jours ouvrés : devis et NDA envoyés au demandeur.' : 'Votre demande est enregistrée. Pré-qualification sous 5 jours ouvrés, puis devis et NDA.',
        state: 'done',
      },
      {
        key: 'kyc', label: 'KYC / KYB',
        desc: isAdmin
          ? (kycOk ? 'Identification du demandeur approuvée.' : kycStarted ? 'Pièces KYC reçues : à vérifier dans Admin › KYC.' : 'En attente des pièces d\'identification du demandeur.')
          : (kycOk ? 'Votre identification est approuvée.' : 'Déposez les pièces d\'identification du représentant légal et de la société.'),
        state: kycOk ? 'done' : 'current',
        href: isAdmin ? '/admin/kyc' : '/client/seller/kyc', cta: isAdmin ? 'Vérifier le KYC' : 'Compléter le KYC',
      },
      {
        key: 'docs', label: 'Data Room',
        desc: isAdmin
          ? (docsOk ? 'Toutes les pièces bloquantes sont vérifiées.' : `Vérifier les pièces déposées (suffisant / insuffisant). ${prescore ? `Complétude ${prescore.completeness} %.` : ''}`)
          : (docsOk ? 'Vos pièces bloquantes sont vérifiées.' : 'Déposez les pièces justificatives par dimension (C, I, F, S, O). Les pièces bloquantes conditionnent le grade.'),
        state: docsOk ? 'done' : (kycOk || docsSome) ? 'current' : 'todo',
        href: isAdmin ? `${adminBase}/documents` : `${clientBase}/documents`, cta: isAdmin ? 'Vérifier les pièces' : 'Ouvrir la Data Room',
      },
      {
        key: 'analysis', label: 'Analyse',
        desc: isAdmin
          ? (expertsPending > 0 ? `${expertsPending} co-signature(s) expert en attente. Renseigner le moteur sur les cinq dimensions.` : 'Renseigner le moteur de grade sur les cinq dimensions, mandater un expert si nécessaire.')
          : 'Analyse indépendante sur les cinq dimensions et revue par des experts mandatés. Aucun score n\'est visible avant la publication.',
        state: validated ? 'done' : (computed || docsOk) ? 'current' : 'todo',
        href: isAdmin ? `${adminBase}/grade-engine` : undefined, cta: isAdmin ? 'Ouvrir le moteur' : undefined,
      },
      {
        key: 'validate', label: 'Validation',
        desc: isAdmin ? 'Valider le grade (override motivé si nécessaire), rédiger le résumé certifié.' : 'Revue indépendante et validation interne du grade.',
        state: published ? 'done' : validated ? 'current' : 'todo',
        href: isAdmin ? `${adminBase}/grade-engine` : undefined,
      },
      {
        key: 'publish', label: dossierType === 'certification' ? 'Certificat' : 'Publication',
        desc: isAdmin
          ? (published ? 'Grade publié : certificat, rapport, kit de communication et vérification publique disponibles.' : 'Publier : requiert KYC approuvé et pièces bloquantes vérifiées.')
          : (published ? 'Certificat, rapport détaillé, feuille de route et kit de communication disponibles. Validité 12 mois.' : 'À la publication : certificat, rapport détaillé, feuille de route et kit de communication.'),
        state: published ? 'done' : (validated && kycOk && docsOk) ? 'current' : 'todo',
        href: !isAdmin && published ? clientBase : undefined,
      },
    ]
    /* Une seule étape « current » : la première non terminée */
    let seen = false
    for (const s of steps) {
      if (s.state === 'done') continue
      if (!seen) { s.state = 'current'; seen = true } else if (s.state === 'current') s.state = 'todo'
    }
  }

  const idx = steps.findIndex(s => s.state === 'current')
  return { steps, currentIndex: idx === -1 ? steps.length - 1 : idx, dossierType }
}
