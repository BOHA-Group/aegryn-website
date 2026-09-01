import {
  Html, Head, Preview, Body, Container,
  Section, Heading, Text, Hr,
} from '@react-email/components'

interface Props {
  company: string
  contactName: string
  email: string
  phone?: string
  roleTitle: string
  location: string
  urgency: string
  locale?: string
}

export default function TalentHiringConfirmation({
  company,
  contactName,
  email,
  phone,
  roleTitle,
  location,
  urgency,
  locale = 'fr',
}: Props) {
  const urgencyLabels = {
    fr: {
      immediate: 'Immédiat (< 1 mois)',
      month: 'Dans le mois',
      quarter: 'Dans le trimestre',
      flexible: 'Flexible',
    },
    en: {
      immediate: 'Immediate (< 1 month)',
      month: 'Within a month',
      quarter: 'Within a quarter',
      flexible: 'Flexible',
    },
  }

  const texts = {
    fr: {
      preview: 'Votre mandat de recrutement Aegryn Talent a été enregistré',
      title: 'Mandat enregistré',
      greeting: `Bonjour ${contactName},`,
      p1: `Nous avons bien reçu votre mandat de recrutement pour le poste de ${roleTitle}.`,
      p2: 'Notre équipe va analyser votre besoin et vous recontacter sous 48h pour discuter des détails du mandat et du processus de recrutement.',
      p3: 'Aegryn Talent se spécialise dans le placement de profils executive tech rares : CTO, CISO, Head of AI, VP Engineering, et autres rôles stratégiques dans l\'écosystème tech européen.',
      summary: 'Récapitulatif de votre mandat',
      roleLabel: 'Poste',
      locationLabel: 'Localisation',
      urgencyLabel: 'Urgence',
      nextSteps: 'Prochaines étapes',
      step1: 'Analyse de votre besoin par notre équipe (48h)',
      step2: 'Appel de qualification et définition du profil cible',
      step3: 'Recherche et présélection de candidats',
      step4: 'Présentation des profils qualifiés',
      confidential: 'Votre mandat reste confidentiel. Nous ne contactons que des candidats pré-qualifiés et ne divulguons votre identité qu\'avec votre accord.',
      contact: 'Pour toute question, contactez-nous à',
      footer: 'Aegryn Talent · Saint-Sulpice, Canton de Vaud · Suisse',
      gdpr: 'Conformément au RGPD/LPD, vous pouvez demander la suppression de vos données à tout moment en nous contactant.',
    },
    en: {
      preview: 'Your Aegryn Talent recruitment mandate has been registered',
      title: 'Mandate registered',
      greeting: `Hello ${contactName},`,
      p1: `We have received your recruitment mandate for the ${roleTitle} position.`,
      p2: 'Our team will analyze your needs and contact you within 48h to discuss the mandate details and recruitment process.',
      p3: 'Aegryn Talent specializes in placing rare executive tech profiles: CTO, CISO, Head of AI, VP Engineering, and other strategic roles in the European tech ecosystem.',
      summary: 'Mandate summary',
      roleLabel: 'Position',
      locationLabel: 'Location',
      urgencyLabel: 'Urgency',
      nextSteps: 'Next steps',
      step1: 'Analysis of your needs by our team (48h)',
      step2: 'Qualification call and target profile definition',
      step3: 'Search and pre-selection of candidates',
      step4: 'Presentation of qualified profiles',
      confidential: 'Your mandate remains confidential. We only contact pre-qualified candidates and only disclose your identity with your consent.',
      contact: 'For any questions, contact us at',
      footer: 'Aegryn Talent · Saint-Sulpice, Canton de Vaud · Switzerland',
      gdpr: 'In accordance with GDPR/LPD, you can request deletion of your data at any time by contacting us.',
    },
  }

  const t = texts[locale as keyof typeof texts] || texts.fr
  const urgencyText = urgencyLabels[locale as keyof typeof urgencyLabels]?.[urgency as keyof typeof urgencyLabels.fr] || urgency

  return (
    <Html lang={locale} dir="ltr">
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>

          <Section style={s.header}>
            <Text style={s.logo}>AEGRYN</Text>
            <Text style={s.sub}>Talent · Recrutement</Text>
          </Section>
          <div style={s.bar} />

          <Section style={s.content}>
            <Heading as="h1" style={s.title}>{t.title}</Heading>
            <Text style={s.bodyText}>{t.greeting}</Text>
            <Text style={s.bodyText}>{t.p1}</Text>
            <Text style={s.bodyText}>{t.p2}</Text>
            <Text style={s.bodyText}>{t.p3}</Text>

            <div style={s.box}>
              <Text style={s.boxTitle}>{t.summary}</Text>
              <Text style={s.boxItem}><strong>{locale === 'fr' ? 'Entreprise' : 'Company'}:</strong> {company}</Text>
              <Text style={s.boxItem}><strong>{t.roleLabel}:</strong> {roleTitle}</Text>
              <Text style={s.boxItem}><strong>{t.locationLabel}:</strong> {location}</Text>
              <Text style={s.boxItem}><strong>{t.urgencyLabel}:</strong> {urgencyText}</Text>
              <Text style={s.boxItem}><strong>Email:</strong> {email}</Text>
              {phone && <Text style={s.boxItem}><strong>{locale === 'fr' ? 'Téléphone' : 'Phone'}:</strong> {phone}</Text>}
            </div>

            <Text style={s.sectionTitle}>{t.nextSteps}</Text>
            <Text style={s.listItem}>1. {t.step1}</Text>
            <Text style={s.listItem}>2. {t.step2}</Text>
            <Text style={s.listItem}>3. {t.step3}</Text>
            <Text style={s.listItem}>4. {t.step4}</Text>

            <div style={s.notice}>
              <Text style={s.noticeText}>{t.confidential}</Text>
            </div>

            <Text style={s.bodyText}>
              {t.contact} <a href="mailto:contact@boha-group.com" style={s.link}>contact@boha-group.com</a>
            </Text>
          </Section>

          <Hr style={s.hr} />

          <Section style={s.footer}>
            <Text style={s.footerText}>{t.footer}</Text>
            <Text style={{ ...s.footerText, fontSize: '11px', marginTop: '8px' }}>
              {t.gdpr}
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
  sub: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#5ADDA4', margin: '4px 0 0' },
  bar: { height: '2px', backgroundColor: '#5ADDA4', margin: '0 32px' },
  content: { padding: '32px' },
  title: { fontSize: '28px', fontWeight: 700, color: '#0A1628', margin: '0 0 24px', lineHeight: '1.3' },
  bodyText: { fontSize: '15px', lineHeight: '1.6', color: '#4A5568', margin: '0 0 16px' },
  sectionTitle: { fontSize: '18px', fontWeight: 600, color: '#0A1628', margin: '24px 0 12px' },
  box: { backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', margin: '24px 0' },
  boxTitle: { fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#0A1628', margin: '0 0 12px' },
  boxItem: { fontSize: '14px', color: '#4A5568', margin: '8px 0', lineHeight: '1.5' },
  listItem: { fontSize: '15px', color: '#4A5568', margin: '8px 0', paddingLeft: '8px' },
  notice: { backgroundColor: '#EDF7F3', border: '1px solid #5ADDA4', borderRadius: '6px', padding: '16px', margin: '24px 0' },
  noticeText: { fontSize: '14px', color: '#0A1628', margin: 0, lineHeight: '1.5' },
  link: { color: '#5ADDA4', textDecoration: 'none', fontWeight: 600 },
  hr: { borderColor: '#E2E8F0', margin: '0' },
  footer: { padding: '24px 32px', textAlign: 'center' as const },
  footerText: { fontSize: '12px', color: '#718096', margin: '4px 0' },
}
