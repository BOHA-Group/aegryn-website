import {
  Html, Head, Preview, Body, Container,
  Section, Heading, Text, Button, Hr,
} from '@react-email/components'

interface Props {
  fullName: string
  email: string
  phone?: string
  linkedinUrl?: string
  availability?: string
  locale?: string
}

export default function TalentCandidateConfirmation({
  fullName,
  email,
  phone,
  linkedinUrl,
  availability,
  locale = 'fr',
}: Props) {
  const texts = {
    fr: {
      preview: 'Votre candidature Aegryn Talent a été enregistrée',
      title: 'Candidature enregistrée',
      greeting: `Bonjour ${fullName},`,
      p1: 'Nous avons bien reçu votre candidature.',
      p2: 'Notre équipe examine actuellement votre profil. Si celui-ci correspond à l\'un de nos mandats de recrutement actifs, nous vous contacterons dans les prochains jours.',
      p3: 'Toutes les opportunités que nous proposons sont des postes executive dans des entreprises tech européennes triées sur le volet : scale-ups en hyper-croissance, leaders SaaS, fintechs et groupes en transformation digitale.',
      summary: 'Récapitulatif de votre candidature',
      availabilityLabel: 'Disponibilité',
      nextSteps: 'Prochaines étapes',
      step1: 'Examen de votre profil par notre équipe',
      step2: 'Si votre profil correspond, entretien de qualification',
      step3: 'Présentation aux entreprises qui recrutent',
      confidential: 'Votre recherche reste strictement confidentielle. Nous ne partagerons votre profil qu\'avec votre accord explicite.',
      contact: 'Pour toute question, contactez-nous à',
      footer: 'Aegryn Talent · Saint-Sulpice, Canton de Vaud · Suisse',
      gdpr: 'Conformément au RGPD/LPD, vous pouvez demander la suppression de vos données à tout moment en nous contactant.',
    },
    en: {
      preview: 'Your Aegryn Talent application has been registered',
      title: 'Application registered',
      greeting: `Hello ${fullName},`,
      p1: 'We have received your application.',
      p2: 'Our team is currently reviewing your profile. If it matches one of our active recruitment mandates, we will contact you in the coming days.',
      p3: 'All opportunities we offer are executive positions in carefully selected European tech companies: hyper-growth scale-ups, SaaS leaders, fintechs, and groups in digital transformation.',
      summary: 'Application summary',
      availabilityLabel: 'Availability',
      nextSteps: 'Next steps',
      step1: 'Review of your profile by our team',
      step2: 'If your profile matches, qualification interview',
      step3: 'Introduction to recruiting companies',
      confidential: 'Your search remains strictly confidential. We will only share your profile with your explicit consent.',
      contact: 'For any questions, contact us at',
      footer: 'Aegryn Talent · Saint-Sulpice, Canton de Vaud · Switzerland',
      gdpr: 'In accordance with GDPR/LPD, you can request deletion of your data at any time by contacting us.',
    },
  }

  const t = texts[locale as keyof typeof texts] || texts.fr

  return (
    <Html lang={locale} dir="ltr">
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>

          <Section style={s.header}>
            <Text style={s.logo}>AEGRYN</Text>
            <Text style={s.sub}>Talent</Text>
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
              <Text style={s.boxItem}><strong>Email:</strong> {email}</Text>
              {phone && <Text style={s.boxItem}><strong>{locale === 'fr' ? 'Téléphone' : 'Phone'}:</strong> {phone}</Text>}
              {linkedinUrl && <Text style={s.boxItem}><strong>LinkedIn:</strong> {linkedinUrl}</Text>}
              {availability && <Text style={s.boxItem}><strong>{t.availabilityLabel}:</strong> {availability}</Text>}
            </div>

            <Text style={s.sectionTitle}>{t.nextSteps}</Text>
            <Text style={s.listItem}>1. {t.step1}</Text>
            <Text style={s.listItem}>2. {t.step2}</Text>
            <Text style={s.listItem}>3. {t.step3}</Text>

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
