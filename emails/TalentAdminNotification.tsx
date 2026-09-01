import {
  Html, Head, Preview, Body, Container,
  Section, Heading, Text, Button, Hr,
} from '@react-email/components'

interface CandidateData {
  fullName: string
  email: string
  phone?: string
  linkedinUrl?: string
  motivation: string
  availability?: string
  locale?: string
}

interface HiringData {
  company: string
  contactName: string
  email: string
  phone?: string
  roleTitle: string
  roleDescription: string
  location: string
  budgetAnnualChf?: string
  urgency: string
  locale?: string
}

interface Props {
  type: 'candidate' | 'hiring'
  data: CandidateData | HiringData
}

export default function TalentAdminNotification({ type, data }: Props) {
  const isCandidate = type === 'candidate'
  const candidateData = isCandidate ? (data as CandidateData) : null
  const hiringData = !isCandidate ? (data as HiringData) : null

  const preview = isCandidate
    ? `Nouvelle candidature - ${candidateData?.fullName}`
    : `Nouveau mandat - ${hiringData?.company} - ${hiringData?.roleTitle}`

  const title = isCandidate ? 'Nouvelle candidature' : 'Nouveau mandat de recrutement'

  const urgencyLabels: Record<string, string> = {
    immediate: 'Immédiat (< 1 mois)',
    month: 'Dans le mois',
    quarter: 'Dans le trimestre',
    flexible: 'Flexible',
  }

  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>

          <Section style={s.header}>
            <Text style={s.logo}>AEGRYN</Text>
            <Text style={s.sub}>Talent · Admin</Text>
          </Section>
          <div style={s.bar} />

          <Section style={s.content}>
            <Heading as="h1" style={s.title}>{title}</Heading>

            {isCandidate && candidateData && (
              <>
                <div style={s.box}>
                  <Text style={s.boxTitle}>Informations candidat</Text>
                  <Text style={s.boxItem}><strong>Nom complet:</strong> {candidateData.fullName}</Text>
                  <Text style={s.boxItem}><strong>Email:</strong> <a href={`mailto:${candidateData.email}`} style={s.link}>{candidateData.email}</a></Text>
                  {candidateData.phone && <Text style={s.boxItem}><strong>Téléphone:</strong> {candidateData.phone}</Text>}
                  {candidateData.linkedinUrl && (
                    <Text style={s.boxItem}>
                      <strong>LinkedIn:</strong> <a href={candidateData.linkedinUrl} style={s.link} target="_blank" rel="noopener noreferrer">Voir profil</a>
                    </Text>
                  )}
                  {candidateData.availability && <Text style={s.boxItem}><strong>Disponibilité:</strong> {candidateData.availability}</Text>}
                  <Text style={s.boxItem}><strong>Langue:</strong> {candidateData.locale?.toUpperCase() || 'FR'}</Text>
                </div>

                <div style={s.motivationBox}>
                  <Text style={s.boxTitle}>Lettre de motivation</Text>
                  <Text style={s.motivationText}>{candidateData.motivation}</Text>
                </div>
              </>
            )}

            {!isCandidate && hiringData && (
              <>
                <div style={s.box}>
                  <Text style={s.boxTitle}>Informations entreprise</Text>
                  <Text style={s.boxItem}><strong>Entreprise:</strong> {hiringData.company}</Text>
                  <Text style={s.boxItem}><strong>Contact:</strong> {hiringData.contactName}</Text>
                  <Text style={s.boxItem}><strong>Email:</strong> <a href={`mailto:${hiringData.email}`} style={s.link}>{hiringData.email}</a></Text>
                  {hiringData.phone && <Text style={s.boxItem}><strong>Téléphone:</strong> {hiringData.phone}</Text>}
                  <Text style={s.boxItem}><strong>Langue:</strong> {hiringData.locale?.toUpperCase() || 'FR'}</Text>
                </div>

                <div style={s.box}>
                  <Text style={s.boxTitle}>Détails du poste</Text>
                  <Text style={s.boxItem}><strong>Intitulé:</strong> {hiringData.roleTitle}</Text>
                  <Text style={s.boxItem}><strong>Localisation:</strong> {hiringData.location}</Text>
                  <Text style={s.boxItem}><strong>Urgence:</strong> {urgencyLabels[hiringData.urgency] || hiringData.urgency}</Text>
                  {hiringData.budgetAnnualChf && <Text style={s.boxItem}><strong>Budget annuel:</strong> {hiringData.budgetAnnualChf}</Text>}
                </div>

                <div style={s.motivationBox}>
                  <Text style={s.boxTitle}>Description du rôle</Text>
                  <Text style={s.motivationText}>{hiringData.roleDescription}</Text>
                </div>
              </>
            )}

            <Section style={s.ctaSection}>
              <Button href="https://aegryn.com/account?tab=talent" style={s.cta}>
                Voir dans l'admin →
              </Button>
            </Section>

            <div style={s.notice}>
              <Text style={s.noticeText}>
                ⚠️ Statut: <strong>NEW</strong> · Action requise sous 48h
              </Text>
            </div>
          </Section>

          <Hr style={s.hr} />

          <Section style={s.footer}>
            <Text style={s.footerText}>Aegryn Talent · Notification automatique</Text>
            <Text style={{ ...s.footerText, fontSize: '11px', marginTop: '8px' }}>
              Cette notification a été envoyée à contact@boha-group.com
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const s = {
  body: { backgroundColor: '#f8f9fa', fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif', padding: '40px 20px' },
  container: { backgroundColor: '#ffffff', maxWidth: '600px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' },
  header: { padding: '32px 32px 16px', textAlign: 'center' as const },
  logo: { fontSize: '24px', fontWeight: 700, letterSpacing: '0.1em', color: '#0A1628', margin: 0 },
  sub: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#D4820A', margin: '4px 0 0' },
  bar: { height: '2px', backgroundColor: '#D4820A', margin: '0 32px' },
  content: { padding: '32px' },
  title: { fontSize: '28px', fontWeight: 700, color: '#0A1628', margin: '0 0 24px', lineHeight: '1.3' },
  box: { backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', margin: '16px 0' },
  boxTitle: { fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#0A1628', margin: '0 0 12px' },
  boxItem: { fontSize: '14px', color: '#4A5568', margin: '8px 0', lineHeight: '1.5' },
  motivationBox: { backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '20px', margin: '16px 0' },
  motivationText: { fontSize: '14px', color: '#4A5568', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' as const },
  ctaSection: { textAlign: 'center' as const, margin: '32px 0' },
  cta: { backgroundColor: '#5ADDA4', color: '#0A1628', padding: '14px 32px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'inline-block' },
  notice: { backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '16px', margin: '24px 0' },
  noticeText: { fontSize: '14px', color: '#991B1B', margin: 0, lineHeight: '1.5' },
  link: { color: '#5ADDA4', textDecoration: 'none', fontWeight: 600 },
  hr: { borderColor: '#E2E8F0', margin: '0' },
  footer: { padding: '24px 32px', textAlign: 'center' as const },
  footerText: { fontSize: '12px', color: '#718096', margin: '4px 0' },
}
