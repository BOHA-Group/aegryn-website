import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Data Protection Notice & Terms of Use — neediu | Aegryn',
    description: 'neediu protects your data with encrypted payments, GDPR & Swiss FADP compliance, and strict privacy standards for users and providers.',
    path: '/data-protection-notice-neediu',
    locale,
  })
}

export default function NeediuLegalPage() {
  return (
    <main className="bg-ag-off-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 md:px-12 py-28">

        {/* Breadcrumb */}
        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.24em] text-ag-gray-light mb-10">
          <Link href="/" className="hover:text-ag-black transition-colors">Aegryn</Link>
          {' / '}
          <span className="text-ag-apex">neediu</span>
          {' / '}Data Protection &amp; Terms
        </p>

        <div className="inline-flex items-center gap-2 border border-ag-border px-3 py-1 mb-6">
          <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-ag-gray-light">
            An Aegryn company
          </span>
        </div>

        <h1 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4"
          style={{ fontSize: 'clamp(32px,4vw,52px)' }}>
          neediu — Data Protection Notice &amp; Terms of Use
        </h1>
        <p className="font-sans font-semibold text-[11px] text-ag-gray-light mb-6">
          Last updated: 03/01/2026
        </p>
        <p className="font-sans font-normal text-[13px] text-ag-gray leading-relaxed mb-16 border-l-2 border-ag-border pl-4">
          Disclaimer: This data protection notice includes an AI translation provided for information purposes only. In the event of any discrepancies, the English version shall prevail.
        </p>

        <div className="prose prose-sm prose-slate max-w-none font-sans
          prose-headings:font-sans prose-headings:font-bold prose-headings:text-ag-black prose-headings:tracking-[-0.02em]
          prose-h2:text-[20px] prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-[15px] prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[14px] prose-p:text-ag-gray prose-p:leading-relaxed
          prose-li:text-[14px] prose-li:text-ag-gray prose-li:leading-relaxed
          prose-a:text-ag-navy prose-a:no-underline hover:prose-a:underline
          prose-strong:text-ag-black">

          {/* ── DATA PROTECTION ── */}
          <h2>Introduction</h2>
          <p>
            neediu is a platform that enables users to quickly identify and connect with trusted professionals or individuals who offer help with home-related needs in their area. As we attach great importance to the protection of your data and your privacy, we have drawn up this data protection notice to explain what we do with your data when you use our platform.
          </p>
          <p>
            This notice only covers data processing related to our platform. Our objective is to ensure adequate protection of personal data in accordance with all applicable data protection laws, including the Swiss Federal Data Protection Act (FADP) and the General Data Protection Regulation (GDPR).
          </p>
          <p>Key definitions from the FADP:</p>
          <ul>
            <li><strong>Data subject:</strong> the natural person whose personal data is processed.</li>
            <li><strong>Personal data:</strong> any information relating to an identified or identifiable natural person.</li>
            <li><strong>Sensitive personal data:</strong> data relating to religious, philosophical, political or trade-union views; health or private sphere; genetic data; biometric data; administrative/criminal proceedings; social assistance measures.</li>
            <li><strong>Processing:</strong> any handling of personal data, including collection, storage, use, modification, disclosure, archiving or destruction.</li>
            <li><strong>Controller:</strong> a private person who, alone or jointly, determines the purpose and means of processing personal data.</li>
            <li><strong>Processor:</strong> the private person that processes personal data on behalf of the controller.</li>
            <li><strong>FDPIC:</strong> Federal Data Protection and Information Commissioner.</li>
          </ul>

          <h2>Who we are and how to contact us</h2>
          <p>
            Aegryn Sàrl (formerly BOHA-Group Sàrl) is the name of our company. If you have any questions about data processing relating to our platform, you can contact us by post at: Aegryn Sàrl, c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Switzerland. You can also contact us at <a href="mailto:legal@aegryn.com">legal@aegryn.com</a>.
          </p>

          <h2>What is our role in data protection?</h2>
          <h3>Our role</h3>
          <p>
            When you use our platform, we may process some of your personal data. In accordance with the FADP, we are the controller. When personal data is shared with a Service Provider for the performance of a job, the Service Provider acts as an independent data controller and is responsible for processing such data in accordance with applicable data protection laws.
          </p>
          <h3>Your role</h3>
          <p>Data protection is everyone&apos;s business. We encourage you to read this notice carefully.</p>

          <h2>When and how do we collect your data?</h2>
          <p>
            Data collection begins as soon as you access or interact with our platform. We collect data directly from you when you use the platform and when you create a User Account, either as a Client or a Service Provider. We do not collect data from third parties, except in the context of targeted marketing campaigns where a limited and indirect collection of personal data may occur.
          </p>

          <h2>What categories of data do we process?</h2>
          <h3>Contact data</h3>
          <p>Your first name, last name, address, telephone number or email address when you create an account.</p>
          <h3>Private data</h3>
          <p>Data relating to your personal circumstances: gender, date of birth, photo, place of origin, contact language, and country of residence.</p>
          <h3>Account data</h3>
          <p>Account status, services offered or requested, profile picture and other preferences, service history, availability settings, participation in reviews or messaging.</p>
          <h3>Economic data</h3>
          <p>Payment method, transaction amounts and history, applicable commissions, billing address, payout data including bank account details. Credit card numbers and CVC numbers are processed solely by our third-party payment providers — we do not store them.</p>
          <h3>Internet and connection data</h3>
          <p>IP address, Internet service provider and device operating system, referring URL, browser used, date and time of access, content viewed during your session.</p>
          <h3>Other data</h3>
          <p>Task type and scope, property size or condition, desired date and time for service, photos or descriptions clarifying the nature of a job, identification data as part of our Know Your Customer (KYC) procedure.</p>
          <h3>What about sensitive data?</h3>
          <p>We do not collect or process any sensitive personal data.</p>
          <h3>What about data relating to minors?</h3>
          <p>Our services are intended exclusively for adults. We do not target minors and do not deliberately collect any personal data relating to them.</p>

          <h2>Why do we process your data?</h2>
          <p>
            We process your personal data to enable you to access and use the platform, including account creation and management, connection between Clients and Service Providers, payment processing, user messaging, and display of relevant information. We also process data to communicate with you, generate anonymised traffic statistics, and comply with applicable laws.
          </p>

          <h2>Do we take automated individual decisions?</h2>
          <p>We use IT tools to manage our activities but do not take any automated individual decisions with these tools.</p>

          <h2>What are your rights?</h2>
          <p>Under the FADP, you have the right to:</p>
          <ul>
            <li>Access your data.</li>
            <li>Request that your data be provided or transmitted in a commonly used electronic format.</li>
            <li>Have inaccurate data corrected.</li>
            <li>Object to the processing of your data.</li>
            <li>Request the deletion or destruction of your data.</li>
            <li>Demand that an automated individual decision be reviewed by a natural person.</li>
          </ul>
          <p>
            To exercise these rights, please <Link href="/contact">contact us</Link>. We may need to verify your identity. You may also report concerns to the <a href="https://www.edoeb.admin.ch/en/" target="_blank" rel="noopener noreferrer">FDPIC</a>.
          </p>

          <h2>How do we keep your data safe?</h2>
          <p>We take appropriate security measures, including encryption, to keep your personal data safe, private, and available. If you believe your data has been compromised, please notify us immediately.</p>

          <h2>Where is your data stored?</h2>
          <p>Personal data is stored on our premises and in processing centres operated by our third-party providers.</p>

          <h2>How long do we keep your data?</h2>
          <p>
            We process your personal data for as long as required for its purpose, or as long as we have a legitimate interest in preserving it (e.g. enforcement of rights, archiving, IT security). Some data may be retained for up to ten years. After these periods, we destroy your personal data.
          </p>

          <h2>Who do we share your data with?</h2>
          <p>
            The management of our platform involves collaboration with specialised third-party providers for creation, maintenance and hosting. All communications are strictly limited to what is necessary and comply with applicable law. Certain personal data is also shared directly between users when necessary for the preparation, execution or follow-up of a requested service.
          </p>
          <p>
            Where personal data is transferred to a third-party provider outside Switzerland or the EEA without adequate protection, we require compliance via <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0914" target="_blank" rel="noopener noreferrer">revised standard contractual clauses</a> of the European Commission.
          </p>

          <h2>What about social networks?</h2>
          <p>
            We operate presences on social networks (Facebook, Instagram, TikTok). When you interact with us on these platforms, we collect data primarily to communicate with you. For more details, consult the respective platform data protection notices.
          </p>

          {/* ── TERMS OF USE ── */}
          <hr className="my-12 border-ag-border" />
          <h2>Terms of Use — neediu Platform</h2>
          <p>
            The following Terms of Use (ToU) apply to any use of the Aegryn Platform, the neediu mobile application, and any service accessible or provided through the Platform (the Services), provided and managed by Aegryn Sàrl, c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Switzerland.
          </p>

          <h3>1. Acceptance</h3>
          <p>
            By accessing or using our Platform, you agree to be bound by these ToU. Any use of the Platform by an employee, agent or representative of a legal entity on behalf of that entity is deemed acceptance by such legal entity.
          </p>

          <h3>2. Modifications</h3>
          <p>
            These ToU may be amended from time to time, in which case you will be notified by appropriate means (including via email or the Platform, e.g. banners, pop-ups or other notification mechanisms). You will need to accept the new ToU to continue using the Platform.
          </p>

          <h3>3. Personal eligibility</h3>
          <p>
            By using the Platform or the Services, you confirm that you are at least 18 years of age and, if using the Platform on behalf of a legal entity, that you are duly authorised to do so.
          </p>

          <h2>Final provisions</h2>
          <p>
            We reserve the right to amend the terms of this data protection notice at our absolute discretion. Any amended version will be posted on our platform.
          </p>
        </div>
      </div>
    </main>
  )
}
