import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
} from '@react-email/components'

export type BroadcastEmailProps = {
  title: string
  bodyText: string
  ctaLabel?: string | null
  ctaUrl?: string | null
  recipientRole: 'buyer' | 'seller' | 'partner' | 'all'
  unsubscribeUrl: string
}

const ROLE_LABEL: Record<string, string> = {
  buyer:   'Espace Acquéreur',
  seller:  'Espace Cédant',
  partner: 'Espace Partenaire',
  all:     'Espace Client',
}

export default function BroadcastEmail({
  title,
  bodyText,
  ctaLabel,
  ctaUrl,
  recipientRole,
  unsubscribeUrl,
}: BroadcastEmailProps) {
  const roleLabel = ROLE_LABEL[recipientRole] ?? 'Espace Client'

  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>{title}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>AEGRYN</Text>
            <Text style={styles.roleTag}>{roleLabel}</Text>
          </Section>

          {/* Divider apex */}
          <div style={styles.apexBar} />

          {/* Content */}
          <Section style={styles.content}>
            <Heading as="h1" style={styles.title}>{title}</Heading>

            {bodyText.split('\n').filter(Boolean).map((para, i) => (
              <Text key={i} style={styles.body_text}>{para}</Text>
            ))}

            {ctaUrl && ctaLabel && (
              <Section style={styles.ctaSection}>
                <Button href={ctaUrl} style={styles.cta}>
                  {ctaLabel}
                </Button>
              </Section>
            )}
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Ce message vous a été envoyé par l&apos;équipe AEGRYN dans le cadre de votre espace client.
            </Text>
            <Text style={styles.footerText}>
              AEGRYN Group SA · Rue du Commerce · Genève, Suisse
            </Text>
            <Text style={styles.footerUnsubscribe}>
              <Link href={unsubscribeUrl} style={styles.unsubLink}>
                Se désabonner des notifications email
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: '#f5f5f3',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    margin: 0,
    padding: '40px 0',
  },
  container: {
    backgroundColor: '#ffffff',
    maxWidth: '580px',
    margin: '0 auto',
    borderRadius: '0px',
    overflow: 'hidden',
    border: '1px solid #e5e5e3',
  },
  header: {
    backgroundColor: '#0a1628',
    padding: '28px 40px 20px',
  },
  logoText: {
    color: '#5ADDA4',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    margin: '0 0 4px 0',
  },
  roleTag: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    margin: '0',
  },
  apexBar: {
    height: '3px',
    backgroundColor: '#5ADDA4',
  },
  content: {
    padding: '40px 40px 32px',
  },
  title: {
    color: '#0a1628',
    fontSize: '22px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '0 0 20px 0',
    letterSpacing: '-0.02em',
  },
  body_text: {
    color: '#444444',
    fontSize: '14px',
    lineHeight: '1.7',
    margin: '0 0 14px 0',
  },
  ctaSection: {
    marginTop: '28px',
  },
  cta: {
    backgroundColor: '#0a1628',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '14px 28px',
    textDecoration: 'none',
    display: 'inline-block',
    borderRadius: '0px',
  },
  hr: {
    borderColor: '#e5e5e3',
    margin: '0 40px',
  },
  footer: {
    padding: '24px 40px 32px',
  },
  footerText: {
    color: '#aaaaaa',
    fontSize: '11px',
    lineHeight: '1.5',
    margin: '0 0 4px 0',
  },
  footerUnsubscribe: {
    marginTop: '12px',
  },
  unsubLink: {
    color: '#aaaaaa',
    fontSize: '11px',
    textDecoration: 'underline',
  },
}
