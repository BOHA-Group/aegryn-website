/**
 * GET /api/magazine/issue-01/cover
 * Generates the Issue 01 magazine cover as a downloadable PDF (A4 portrait).
 * Uses @react-pdf/renderer — pure server-side, no Puppeteer.
 *
 * Layout inspired by high-end print magazine covers (Ginyard style):
 *   — Full-bleed dark background (image placeholder zone)
 *   — Masthead "AEGRYN" top-left, date top-right
 *   — Large title block bottom-left
 *   — Right column: featured story teasers
 *   — Footer: section pills
 */

import { NextResponse }  from 'next/server'
import React             from 'react'
import {
  Document, Page, View, Text, StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer'

/* ── Colour tokens ─────────────────────────────────────────────── */
const C = {
  black:    '#0A0A0A',
  white:    '#FFFFFF',
  ivory:    '#F4F3F0',
  accent:   '#2EAF7D',   // AEGRYN green
  dim:      '#FFFFFF26', // white 15%
  dimHeavy: '#FFFFFF12', // white 7%
  mid:      '#FFFFFF80', // white 50%
  faint:    '#FFFFFF40', // white 25%
  accent20: '#2EAF7D33', // green 20%
}

/* ── Typography ────────────────────────────────────────────────── */
// @react-pdf uses built-in fonts by default; we embed a clean sans stack.
// Helvetica is available as a built-in PDF font — good enough for a mock.

const s = StyleSheet.create({
  page: {
    backgroundColor: C.black,
    width:  '210mm',
    height: '297mm',
    position: 'relative',
    fontFamily: 'Helvetica',
  },

  /* ── Top bar ── */
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 48,
    borderBottomWidth: 0.5,
    borderBottomColor: C.dim,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topBarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  issuePill: {
    borderWidth: 0.5,
    borderColor: C.dim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  issuePillText: {
    color: C.faint,
    fontSize: 7,
    letterSpacing: 2,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  topMeta: {
    color: C.faint,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  /* ── Masthead ── */
  masthead: {
    position: 'absolute',
    top: 72,
    left: 32,
    right: 32,
    borderBottomWidth: 0.5,
    borderBottomColor: C.dim,
    paddingBottom: 16,
  },
  mastheadTitle: {
    color: C.white,
    fontSize: 64,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -2,
    lineHeight: 0.9,
  },
  mastheadSub: {
    color: C.accent,
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 6,
    fontFamily: 'Helvetica',
  },

  /* ── Image zone (placeholder — replaced by real photo later) ── */
  imageZone: {
    position: 'absolute',
    top: 168,
    left: 0,
    right: 0,
    height: '48%',
    backgroundColor: '#1A1A1A',
    borderTopWidth: 0.5,
    borderTopColor: C.dim,
    borderBottomWidth: 0.5,
    borderBottomColor: C.dim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: C.faint,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  imagePlaceholderNote: {
    color: '#FFFFFF1A',
    fontSize: 7,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 6,
  },

  /* ── Left column stories ── */
  leftStory: {
    position: 'absolute',
    top: 176,
    left: 32,
    width: 130,
  },
  storyCategory: {
    color: C.accent,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  storyTitle: {
    color: C.white,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.25,
    letterSpacing: -0.3,
  },
  storyExcerpt: {
    color: C.mid,
    fontSize: 8,
    lineHeight: 1.5,
    marginTop: 6,
    letterSpacing: 0.3,
  },

  /* ── Right column teaser ── */
  rightTeaser: {
    position: 'absolute',
    top: 312,
    right: 32,
    width: 130,
    borderTopWidth: 0.5,
    borderTopColor: C.dim,
    paddingTop: 10,
  },
  teaserLabel: {
    color: C.faint,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  teaserTitle: {
    color: C.white,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
    letterSpacing: -0.2,
  },

  /* ── Main cover headline ── */
  headline: {
    position: 'absolute',
    bottom: 110,
    left: 32,
    right: 32,
    borderTopWidth: 0.5,
    borderTopColor: C.dim,
    paddingTop: 20,
  },
  headlineLabel: {
    color: C.accent,
    fontSize: 7,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  headlineTitle: {
    color: C.white,
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.05,
    letterSpacing: -1,
  },
  headlineSub: {
    color: C.mid,
    fontSize: 9,
    lineHeight: 1.5,
    marginTop: 10,
    letterSpacing: 0.3,
    maxWidth: 320,
  },

  /* ── Stat badge ── */
  statBadge: {
    position: 'absolute',
    bottom: 110,
    right: 32,
    backgroundColor: C.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 2,
    alignItems: 'center',
  },
  statVal: {
    color: C.black,
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.5,
    lineHeight: 1,
  },
  statLbl: {
    color: '#0A0A0ACC',
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 3,
    textAlign: 'center',
  },

  /* ── Footer ── */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    borderTopWidth: 0.5,
    borderTopColor: C.dim,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  footerSections: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  sectionPill: {
    borderWidth: 0.5,
    borderColor: C.dim,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  sectionPillAccent: {
    borderWidth: 0.5,
    borderColor: C.accent,
    backgroundColor: C.accent20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  sectionPillText: {
    color: C.faint,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionPillTextAccent: {
    color: C.accent,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: C.dimHeavy,
    paddingTop: 10,
  },
  footerMetaText: {
    color: '#FFFFFF25',
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
})

/* ── Cover Document ─────────────────────────────────────────────── */
function CoverDocument() {
  return (
    <Document
      title="Aegryn Magazine — Issue 01 — The State of European Tech M&A"
      author="AEGRYN"
      subject="European Tech M&A Intelligence — January 2027"
      keywords="M&A, SaaS, Europe, tech, CIFS, certification, Aegryn"
      creator="Aegryn Magazine"
      producer="@react-pdf/renderer"
    >
      <Page size="A4" style={s.page}>

        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <View style={s.topBarLeft}>
            <View style={s.topBarDot} />
            <View style={s.issuePill}>
              <Text style={s.issuePillText}>Issue 01</Text>
            </View>
          </View>
          <View style={s.topBarRight}>
            <Text style={s.topMeta}>January 2027</Text>
            <Text style={s.topMeta}>European Tech M&amp;A Intelligence</Text>
          </View>
        </View>

        {/* ── Masthead ── */}
        <View style={s.masthead}>
          <Text style={s.mastheadTitle}>AEGRYN</Text>
          <Text style={s.mastheadSub}>Magazine · Intelligence · First Edition</Text>
        </View>

        {/* ── Image zone ── */}
        <View style={s.imageZone}>
          <Text style={s.imagePlaceholderText}>[ Cover Image ]</Text>
          <Text style={s.imagePlaceholderNote}>Replace with your photo before final export</Text>
        </View>

        {/* ── Left story block (overlays image) ── */}
        <View style={s.leftStory}>
          <Text style={s.storyCategory}>The CIFS Protocol</Text>
          <Text style={s.storyTitle}>{"Code, IP, Finance,\nSecurity"}</Text>
          <Text style={s.storyExcerpt}>
            {"Our certification methodology explained.\nFour dimensions, one objective grade."}
          </Text>
        </View>

        {/* ── Right teaser ── */}
        <View style={s.rightTeaser}>
          <Text style={s.teaserLabel}>Special Report</Text>
          <Text style={s.teaserTitle}>{"Who Is Buying\nEuropean Tech\nin 2027"}</Text>
        </View>

        {/* ── Stat badge ── */}
        <View style={s.statBadge}>
          <Text style={s.statVal}>€14.2B</Text>
          <Text style={s.statLbl}>{"EU Tech M&A\nVolume 2025"}</Text>
        </View>

        {/* ── Main headline ── */}
        <View style={s.headline}>
          <Text style={s.headlineLabel}>Cover Story</Text>
          <Text style={s.headlineTitle}>{"The State of\nEuropean\nTech M&A"}</Text>
          <Text style={s.headlineSub}>
            {"Volumes, multiples, geographies — H1–H2 2026 data.\nThe European discount is narrowing. Are founders ready?"}
          </Text>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View style={s.footerSections}>
            {[
              { label: 'Build',    accent: true  },
              { label: 'Money',   accent: false },
              { label: 'AI',      accent: false },
              { label: 'People',  accent: false },
              { label: 'Life',    accent: false },
            ].map(({ label, accent }) => (
              <View key={label} style={accent ? s.sectionPillAccent : s.sectionPill}>
                <Text style={accent ? s.sectionPillTextAccent : s.sectionPillText}>{label}</Text>
              </View>
            ))}
          </View>
          <View style={s.footerMeta}>
            <Text style={s.footerMetaText}>aegryn.com/magazine/issue-01</Text>
            <Text style={s.footerMetaText}>Annual Publication — Digital + Print</Text>
            <Text style={s.footerMetaText}>© 2027 AEGRYN · All rights reserved</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}

/* ── Route handler ──────────────────────────────────────────────── */
export async function GET() {
  const buffer = await renderToBuffer(<CoverDocument />)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': 'inline; filename="aegryn-magazine-issue-01-cover.pdf"',
      'Cache-Control':       'no-store',
    },
  })
}
