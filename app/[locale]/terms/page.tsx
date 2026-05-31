import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Terms of Use | Aegryn',
    description: 'Terms governing your use of the Aegryn website and services.',
    path: '/terms',
    locale,
  })
}

export default function TermsPage() {
  return (
    <main className="bg-ag-off-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 md:px-12 py-28">

        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.24em] text-ag-gray-light mb-10">
          <Link href="/" className="hover:text-ag-black transition-colors">Aegryn</Link>
          {' / '}Terms of Use
        </p>

        <h1 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4"
          style={{ fontSize: 'clamp(32px,4vw,52px)' }}>
          Terms of Use
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
            These Terms of Use govern your access to and use of the <strong>Aegryn</strong> website (<a href="https://aegryn.com">aegryn.com</a>) and any related services provided by <strong>Aegryn Sàrl</strong> (formerly BOHA-Group Sàrl), c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Switzerland.
          </p>
          <p>
            For terms specific to the neediu platform, please refer to the <Link href="/data-protection-notice-neediu">neediu Terms of Use</Link>.
          </p>

          <h2>1. Acceptance</h2>
          <p>
            By accessing or using our website, you agree to be bound by these Terms of Use. If you do not agree, please do not use the website.
          </p>

          <h2>2. Use of the website</h2>
          <p>
            The Aegryn website is a corporate presentation website. It does not sell products or services directly. All content is provided for informational purposes only. You may not use this website for any unlawful purpose or in any way that could damage, disable, or impair the website or its services.
          </p>

          <h2>3. Intellectual property</h2>
          <p>
            All content on this website — including text, graphics, logos, images and software — is the property of Aegryn Sàrl or its content suppliers and is protected by applicable intellectual property laws. Unauthorised use, reproduction or distribution is prohibited.
          </p>

          <h2>4. Limitation of liability</h2>
          <p>
            Aegryn Sàrl makes no warranties, expressed or implied, regarding the accuracy, completeness or reliability of the information on this website. We shall not be liable for any loss or damage arising from reliance on the information provided.
          </p>

          <h2>5. Third-party links</h2>
          <p>
            Our website may contain links to third-party websites. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
          </p>

          <h2>6. Privacy</h2>
          <p>
            Your use of this website is also governed by our <Link href="/privacy">Privacy Policy</Link> and <Link href="/data-protection-notice">Data Protection Notice</Link>.
          </p>

          <h2>7. Governing law</h2>
          <p>
            These Terms of Use shall be governed by and construed in accordance with Swiss law. Any disputes shall be subject to the exclusive jurisdiction of the courts of the Canton of Vaud, Switzerland.
          </p>

          <h2>8. Amendments</h2>
          <p>
            We reserve the right to modify these Terms at any time. The updated version will be published on this page. Continued use of the website after any changes constitutes your acceptance of the new terms.
          </p>

          <h2>Contact</h2>
          <p>
            For any questions regarding these Terms, please <Link href="/contact">contact us</Link> or write to: Aegryn Sàrl, c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Switzerland — <a href="mailto:legal@aegryn.com">legal@aegryn.com</a>
          </p>
        </div>
      </div>
    </main>
  )
}
