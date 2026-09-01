'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import TalentHiringForm from '@/components/forms/TalentHiringForm'
import TalentCandidateForm from '@/components/forms/TalentCandidateForm'

export default function TalentPageClient({ locale }: { locale: string }) {
  const t = useTranslations('talent')
  const [activeTab, setActiveTab] = useState<'candidate' | 'employer'>('candidate')

  return (
    <>
      {/* Hero with Toggle */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15] max-w-3xl mb-12"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            {t('hero.title')}
          </h1>
          
          {/* Toggle */}
          <div className="inline-flex border border-ag-border bg-white">
            <button
              onClick={() => setActiveTab('candidate')}
              className={`px-8 py-4 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase transition-all ${
                activeTab === 'candidate'
                  ? 'bg-ag-navy text-white'
                  : 'bg-white text-ag-gray hover:text-ag-black'
              }`}
            >
              {t('toggle.candidate')}
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`px-8 py-4 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase transition-all border-l border-ag-border ${
                activeTab === 'employer'
                  ? 'bg-ag-navy text-white'
                  : 'bg-white text-ag-gray hover:text-ag-black'
              }`}
            >
              {t('toggle.employer')}
            </button>
          </div>
        </div>
      </section>

      {/* Content conditionnel */}
      {activeTab === 'candidate' ? (
        <>
          {/* Candidate: Intro */}
          <section className="py-24 border-b border-ag-border">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <h2
                    className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6"
                    style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
                  >
                    {t('candidate.intro.title')}
                  </h2>
                  <p className="text-[15px] text-ag-gray leading-relaxed">
                    {t('candidate.intro.desc')}
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-2">
                      {t('candidate.benefits.network.title')}
                    </h3>
                    <p className="text-[14px] text-ag-gray leading-relaxed">
                      {t('candidate.benefits.network.desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-2">
                      {t('candidate.benefits.confidential.title')}
                    </h3>
                    <p className="text-[14px] text-ag-gray leading-relaxed">
                      {t('candidate.benefits.confidential.desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-2">
                      {t('candidate.benefits.curated.title')}
                    </h3>
                    <p className="text-[14px] text-ag-gray leading-relaxed">
                      {t('candidate.benefits.curated.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Candidate: Form */}
          <section className="py-24 bg-ag-off-white">
            <div className="max-w-3xl mx-auto px-6 md:px-12">
              <h2 className="font-sans font-bold text-ag-black text-[32px] tracking-[-0.02em] mb-4">
                {t('forms.candidate.title')}
              </h2>
              <p className="text-[14px] text-ag-gray leading-relaxed mb-10">
                {t('forms.candidate.desc')}
              </p>
              <TalentCandidateForm />
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Employer: Intro */}
          <section className="py-24 border-b border-ag-border">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <h2
                    className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6"
                    style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
                  >
                    {t('employer.intro.title')}
                  </h2>
                  <p className="text-[15px] text-ag-gray leading-relaxed">
                    {t('employer.intro.desc')}
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-2">
                      {t('employer.profiles.cto.title')}
                    </h3>
                    <p className="text-[14px] text-ag-gray leading-relaxed">
                      {t('employer.profiles.cto.desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-2">
                      {t('employer.profiles.ciso.title')}
                    </h3>
                    <p className="text-[14px] text-ag-gray leading-relaxed">
                      {t('employer.profiles.ciso.desc')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-2">
                      {t('employer.profiles.headAI.title')}
                    </h3>
                    <p className="text-[14px] text-ag-gray leading-relaxed">
                      {t('employer.profiles.headAI.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Employer: Process */}
          <section className="bg-ag-off-white py-24 border-b border-ag-border">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-16"
                style={{ fontSize: 'clamp(26px,3vw,44px)' }}
              >
                {t('employer.process.title')}
              </h2>
              <div className="grid sm:grid-cols-3 gap-12">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex mb-4">01</div>
                  <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                    {t('employer.process.brief.title')}
                  </h3>
                  <p className="text-[13px] text-ag-gray leading-relaxed">
                    {t('employer.process.brief.desc')}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex mb-4">02</div>
                  <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                    {t('employer.process.search.title')}
                  </h3>
                  <p className="text-[13px] text-ag-gray leading-relaxed">
                    {t('employer.process.search.desc')}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex mb-4">03</div>
                  <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                    {t('employer.process.placement.title')}
                  </h3>
                  <p className="text-[13px] text-ag-gray leading-relaxed">
                    {t('employer.process.placement.desc')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Employer: Form */}
          <section className="py-24">
            <div className="max-w-3xl mx-auto px-6 md:px-12">
              <h2 className="font-sans font-bold text-ag-black text-[32px] tracking-[-0.02em] mb-4">
                {t('forms.hiring.title')}
              </h2>
              <p className="text-[14px] text-ag-gray leading-relaxed mb-10">
                {t('forms.hiring.desc')}
              </p>
              <TalentHiringForm />
            </div>
          </section>
        </>
      )}
    </>
  )
}
