import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Privacy Policy | Aegryn',
    description: 'How Aegryn collects, uses and protects your personal data in compliance with Swiss FADP and GDPR.',
    path: '/privacy',
    locale,
  })
}

export default function PrivacyPage() {
  return (
    <main className="bg-ag-off-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 md:px-12 py-28">

        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.24em] text-ag-gray-light mb-10">
          <Link href="/" className="hover:text-ag-black transition-colors">Aegryn</Link>
          {' / '}Privacy Policy
        </p>

        <h1 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4"
          style={{ fontSize: 'clamp(32px,4vw,52px)' }}>
          Privacy Policy
        </h1>
        <p className="font-sans font-semibold text-[11px] text-ag-gray-light mb-16">Last updated: 03/01/2026</p>

        <div className="prose prose-sm prose-slate max-w-none font-sans
          prose-headings:font-sans prose-headings:font-bold prose-headings:text-ag-black prose-headings:tracking-[-0.02em]
          prose-h2:text-[20px] prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-[15px] prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[14px] prose-p:text-ag-gray prose-p:leading-relaxed
          prose-li:text-[14px] prose-li:text-ag-gray prose-li:leading-relaxed
          prose-a:text-ag-navy prose-a:no-underline hover:prose-a:underline
          prose-strong:text-ag-black">

          <p>
            This Privacy Policy explains how <strong>Aegryn Sàrl</strong> (formerly BOHA-Group Sàrl) collects, uses and protects personal data when you visit <a href="https://aegryn.com">aegryn.com</a> or use our services. It is designed to comply with the Swiss Federal Act on Data Protection (FADP) and the General Data Protection Regulation (GDPR) where applicable.
          </p>
          <p>
            For full details on our data practices, please read our <Link href="/data-protection-notice">Data Protection Notice</Link>.
          </p>
          <p>
            For data protection details specific to the neediu platform, please read the <Link href="/data-protection-notice-neediu">neediu Data Protection Notice &amp; Terms of Use</Link>.
          </p>

          <h2>Who we are</h2>
          <p>
            Aegryn Sàrl, c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Switzerland.<br />
            Contact: <a href="mailto:legal@aegryn.com">legal@aegryn.com</a>
          </p>

          <h2>What data we collect</h2>
          <ul>
            <li>Contact data (name, email, phone) when you reach out to us.</li>
            <li>Connection and browsing data (IP address, browser, pages visited) for technical and analytics purposes.</li>
          </ul>

          <h2>How we use your data</h2>
          <ul>
            <li>To respond to your enquiries.</li>
            <li>To improve our website and services.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2>Your rights</h2>
          <p>
            You have the right to access, correct, delete or port your data, and to object to its processing. To exercise your rights, <Link href="/contact">contact us</Link> or write to us at the address above.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies to operate our website. You can manage your preferences via our cookie banner or your browser settings.
          </p>

          <h2>Amendments</h2>
          <p>
            We may update this policy at any time. The latest version is always available on this page.
          </p>
        </div>
      </div>
    </main>
  )
}
