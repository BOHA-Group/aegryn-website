import {
  Html, Head, Preview, Body, Container,
  Section, Heading, Text, Button, Hr, Link,
} from '@react-email/components'

interface Props {
  email: string
}

export default function MagazineConfirmEmail({ email }: Props) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're on the Aegryn Magazine list — Issue 02 arrives in April 2027.</Preview>
      <Body style={s.body}>
        <Container style={s.container}>

          {/* Header */}
          <Section style={s.header}>
            <Text style={s.logo}>AEGRYN</Text>
            <Text style={s.sub}>Magazine — Digital Access</Text>
          </Section>
          <div style={s.bar} />

          {/* Content */}
          <Section style={s.content}>
            <Heading as="h1" style={s.title}>You're on the list.</Heading>
            <Text style={s.body_text}>
              We've registered <strong>{email}</strong> for Aegryn Magazine digital access.
            </Text>
            <Text style={s.body_text}>
              Issue 01 — <em>Built to Last</em> — is available now. Issue 02 — <em>The Exit Equation</em> — arrives in April 2027.
            </Text>
            <Text style={s.body_text}>
              No paywall. No advertising. Published quarterly.
            </Text>
            <Section style={s.ctaSection}>
              <Button href="https://aegryn.com/magazine/issue-01" style={s.cta}>
                Read Issue 01 →
              </Button>
            </Section>
          </Section>

          <Hr style={s.hr} />

          {/* Footer */}
          <Section style={s.footer}>
            <Text style={s.footerText}>
              Aegryn SA · Saint-Sulpice, Canton de Vaud · Switzerland
            </Text>
            <Text style={s.footerText}>
              Editorial contact:{' '}
              <Link href="mailto:media@boha-group.com" style={s.link}>
                media@boha-group.com
              </Link>
            </Text>
            <Text style={s.footerUnsubscribe}>
              You received this because you subscribed at aegryn.com/magazine.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const s: Record<string, React.CSSProperties> = {
  body:      { backgroundColor: '#F7F5F1', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: '40px 0' },
  container: { backgroundColor: '#ffffff', maxWidth: '560px', margin: '0 auto', border: '1px solid #E4E1DC' },
  header:    { backgroundColor: '#0F1A2B', padding: '28px 40px 20px' },
  logo:      { color: '#5ADDA4', fontSize: '12px', fontWeight: '700', letterSpacing: '0.24em', textTransform: 'uppercase', margin: '0 0 3px 0' },
  sub:       { color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 },
  bar:       { height: '3px', backgroundColor: '#5ADDA4' },
  content:   { padding: '40px 40px 32px' },
  title:     { color: '#0F1A2B', fontSize: '22px', fontWeight: '700', lineHeight: '1.3', margin: '0 0 20px 0', letterSpacing: '-0.02em' },
  body_text: { color: '#444444', fontSize: '14px', lineHeight: '1.75', margin: '0 0 14px 0' },
  ctaSection:{ marginTop: '28px' },
  cta:       { backgroundColor: '#0F1A2B', color: '#ffffff', fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' },
  hr:        { borderColor: '#E4E1DC', margin: '0 40px' },
  footer:    { padding: '24px 40px 32px' },
  footerText:{ color: '#aaaaaa', fontSize: '11px', lineHeight: '1.5', margin: '0 0 4px 0' },
  footerUnsubscribe: { color: '#cccccc', fontSize: '10px', marginTop: '12px' },
  link:      { color: '#aaaaaa' },
}
