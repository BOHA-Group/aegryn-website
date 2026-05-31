import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Data Protection Notice | Aegryn',
    description: 'Discover how Aegryn protects your data and complies with Swiss FADP and GDPR.',
    path: '/data-protection-notice',
    locale,
  })
}

export default function DataProtectionPage() {
  return (
    <main className="bg-ag-off-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 md:px-12 py-28">

        {/* Breadcrumb */}
        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.24em] text-ag-gray-light mb-10">
          <Link href="/" className="hover:text-ag-black transition-colors">Aegryn</Link>
          {' / '}Data Protection Notice
        </p>

        <h1 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4"
          style={{ fontSize: 'clamp(32px,4vw,52px)' }}>
          Data Protection Notice
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

          <h2>Introduction</h2>
          <p>
            As we attach great importance to the protection of your data and your privacy, we have drawn up this data protection notice to explain what we do when you visit our website <a href="https://aegryn.com">aegryn.com</a>.
          </p>
          <p>
            This data protection notice only covers data processing related to our website. Specific data protection notices may apply to other services and offerings we provide.
          </p>
          <p>
            In Switzerland, the protection of your data is based in particular on the Federal Act of 25 September 2020 on Data Protection (FADP), as well as on the Federal Ordinance of 31 August on Data Protection (DPO). Our data protection notice, as well as our practices, is aligned with the legal provisions contained within the legislation mentioned.
          </p>
          <p>Key definitions from the FADP:</p>
          <ul>
            <li><strong>Data subject:</strong> the natural person whose personal data is processed.</li>
            <li><strong>Personal data:</strong> any information relating to an identified or identifiable natural person.</li>
            <li><strong>Sensitive personal data:</strong> data relating to religious, philosophical, political or trade-union views or activities; data relating to health, the private sphere or affiliation to a race or ethnicity; genetic data; biometric data; data relating to administrative and criminal proceedings or sanctions; data relating to social assistance measures.</li>
            <li><strong>Processing:</strong> any handling of personal data, irrespective of the means and procedures used.</li>
            <li><strong>Controller:</strong> a private person who, alone or jointly with others, determines the purpose and the means of processing personal data.</li>
            <li><strong>Processor:</strong> the private person that processes personal data on behalf of the controller.</li>
            <li><strong>FDPIC:</strong> Federal Data Protection and Information Commissioner.</li>
          </ul>

          <h2>Who we are and how to contact us</h2>
          <p>
            Aegryn Sàrl (formerly BOHA-Group Sàrl) is the name of our company. If you have any questions about the processing of data relating to our website, you can contact us by post at: Aegryn Sàrl, c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Switzerland. You can also contact us by e-mail at <a href="mailto:legal@aegryn.com">legal@aegryn.com</a> or via our <Link href="/contact">contact form</Link>.
          </p>

          <h2>What is our role in data protection?</h2>
          <h3>Our role</h3>
          <p>
            As controller, we are responsible for determining the purposes for which we process your personal data, the manner in which it is processed, and the security measures. When we work with service providers, we ensure that they share our commitment to data protection and comply with the same standards.
          </p>
          <h3>Your role</h3>
          <p>
            Data protection is everyone&apos;s business. We encourage you to read this notice carefully.
          </p>

          <h2>When and how do we collect your data?</h2>
          <p>
            As soon as you interact with our website for the first time, we collect data (e.g. to determine whether you consent to the use of cookies). You also provide us with your data when you contact us via our contact form.
          </p>

          <h2>What categories of data do we process?</h2>
          <h3>Contact data</h3>
          <p>We process your contact data, such as your first name, last name, address, telephone number or email address.</p>
          <h3>Internet and connection data</h3>
          <p>For technical reasons and to improve our website, each time you use it, certain data is generated: your IP address, information about your Internet service provider and your device&apos;s operating system, the referring URL, browser used, date and time of access, and content viewed during your visit.</p>
          <h3>What about sensitive data?</h3>
          <p>We do not collect or process any sensitive personal data.</p>
          <h3>What about data relating to minors?</h3>
          <p>Although access to our website is open to everyone, our services are intended exclusively for adults. We do not target minors and do not deliberately collect any personal data relating to them.</p>

          <h2>Why do we process your data?</h2>
          <p>
            We process your data to communicate with you, to respond to your requests, to inform you about our services, to generate anonymised traffic statistics to improve our website, and to comply with applicable laws and authority recommendations.
          </p>

          <h2>Do we take automated individual decisions?</h2>
          <p>
            We use IT tools to manage our activities, but we do not take any automated individual decisions with these tools.
          </p>

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
            To exercise any of these rights, please <Link href="/contact">contact us</Link>. We may need to verify your identity before proceeding. You may also report concerns to the <a href="https://www.edoeb.admin.ch/en/" target="_blank" rel="noopener noreferrer">FDPIC</a>.
          </p>

          <h2>How do we keep your data safe?</h2>
          <p>
            We take appropriate security measures, including encryption, to keep your personal data safe, private, and available. If you believe your data has been compromised, please notify us immediately.
          </p>

          <h2>Where is your data stored?</h2>
          <p>Personal data is stored on our premises and in processing centres operated by our service providers.</p>

          <h2>How long do we keep your data?</h2>
          <p>
            We process your personal data for as long as the purpose of processing requires it, or for as long as we have a legitimate interest in preserving it (e.g. to enforce rights, for archiving or IT security). Some data may be retained for up to ten years. Once these periods have elapsed, we destroy your personal data.
          </p>

          <h2>Who do we share your data with?</h2>
          <p>
            The management of our website involves collaboration with specialised external service providers, particularly for its creation, maintenance and hosting. All communications are strictly limited to what is necessary and are carried out in compliance with the legal framework.
          </p>
          <p>
            Where personal data is transferred to a service provider outside Switzerland or the EEA without adequate protection, we require compliance with applicable data protection legislation via <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021D0914" target="_blank" rel="noopener noreferrer">revised standard contractual clauses</a> of the European Commission, unless another exception applies.
          </p>

          <h2>Which cookies do we use?</h2>
          <p>
            Our website uses cookies. You can access the list of cookie types via our cookie banner. You can block cookies in your browser settings, though this may affect the functionality of our website.
          </p>

          <h2>What about social networks?</h2>
          <p>
            We operate presences on social networks (LinkedIn, Instagram, TikTok, YouTube, Facebook). When you interact with us on these platforms, we collect data primarily to communicate with you. For more details, consult the relevant platform data protection notices.
          </p>

          <h2>Final provisions</h2>
          <p>
            We reserve the right to amend this data protection notice at our absolute discretion. Any updated version will be posted on our website.
          </p>
        </div>
      </div>
    </main>
  )
}
