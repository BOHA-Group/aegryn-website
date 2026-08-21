/**
 * GET /api/magazine/issue-01/cover
 * Generates the Issue 01 magazine cover as a downloadable PDF (A4 portrait).
 * Uses @react-pdf/renderer — pure server-side, no Puppeteer.
 *
 * Layout inspired by Salford Business Magazine style:
 *   — White/light background — NO black pages
 *   — Top bar: date left, "SPECIAL EDITION / ISSUE 01" right
 *   — Large masthead "Aegryn" top-center
 *   — "BUSINESS INTELLIGENCE" sub-label
 *   — Full-bleed photo zone (light placeholder)
 *   — Left sidebar: EXCLUSIVE label + story teaser
 *   — Bottom: large accent "BUILD TO LAST" headline
 *   — Subtitle body copy
 */

import { NextResponse }  from 'next/server'
import React             from 'react'
import {
  Document, Page, View, Text, StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer'

/* ── Colour tokens (light-mode) ─────────────────────────────────── */
const C = {
  white:      '#FFFFFF',
  pageBg:     '#F7F6F4',   // warm off-white
  black:      '#0D0D0D',
  darkGray:   '#1A1A1A',
  midGray:    '#555555',
  lightGray:  '#AAAAAA',
  rule:       '#DDDDDD',
  photoBg:    '#CCCCCC',   // neutral gray for photo placeholder
  accent:     '#2EAF7D',   // AEGRYN green — used for section label
  accentDark: '#1D8C61',
}

const s = StyleSheet.create({
  page: {
    backgroundColor: C.pageBg,
    width:  '210mm',
    height: '297mm',
    position: 'relative',
    fontFamily: 'Helvetica',
  },

  /* ── Top bar ── */
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    backgroundColor: C.white,
    borderBottomWidth: 0.5,
    borderBottomColor: C.rule,
  },
  topDate: {
    color: C.midGray,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica',
  },
  topEditionBlock: {
    alignItems: 'flex-end',
  },
  topEditionLabel: {
    color: C.accent,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
  },
  topIssue: {
    color: C.midGray,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica',
  },

  /* ── Masthead ── */
  masthead: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.black,
  },
  mastheadTitle: {
    color: C.black,
    fontSize: 72,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -2,
    lineHeight: 0.88,
  },
  mastheadSub: {
    color: C.midGray,
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 6,
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },

  /* ── Photo zone (full-bleed placeholder) ── */
  photoZone: {
    position: 'absolute',
    top: 178,
    left: 0,
    right: 0,
    height: 330,
    backgroundColor: C.photoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    color: '#888888',
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  photoPlaceholderNote: {
    color: '#AAAAAA',
    fontSize: 7,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Helvetica',
  },

  /* ── Left sidebar (overlaid on photo) ── */
  leftSidebar: {
    position: 'absolute',
    top: 196,
    left: 28,
    width: 140,
  },
  exclusiveLabel: {
    color: C.accent,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  exclusiveLine: {
    width: 32,
    height: 1.5,
    backgroundColor: C.accent,
    marginBottom: 8,
  },
  sidebarText: {
    color: C.white,
    fontSize: 8.5,
    lineHeight: 1.5,
    letterSpacing: 0.3,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
  },

  /* ── Headline block (bottom, over white band) ── */
  headlineBand: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 155,
    backgroundColor: C.white,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headlineTitle: {
    color: C.accent,
    fontSize: 34,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.5,
    lineHeight: 1.0,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  headlineSub: {
    color: C.midGray,
    fontSize: 8,
    lineHeight: 1.55,
    letterSpacing: 0.2,
    fontFamily: 'Helvetica',
    maxWidth: 430,
    textAlign: 'center',
  },
})

/* ── Cover Document ─────────────────────────────────────────────── */
function CoverDocument() {
  return (
    <Document
      title="Aegryn — Build to Last — Issue 01"
      author="AEGRYN"
      subject="European Tech M&A Intelligence — January 2027"
      keywords="M&A, SaaS, Europe, tech, CIFS, certification, Aegryn"
      creator="Aegryn Magazine"
      producer="@react-pdf/renderer"
    >
      <Page size="A4" style={s.page}>

        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <Text style={s.topDate}>January 2027</Text>
          <View style={s.topEditionBlock}>
            <Text style={s.topEditionLabel}>Special Edition</Text>
            <Text style={s.topIssue}>Issue 01</Text>
          </View>
        </View>

        {/* ── Masthead ── */}
        <View style={s.masthead}>
          <Text style={s.mastheadTitle}>Aegryn</Text>
          <Text style={s.mastheadSub}>Business Intelligence</Text>
        </View>

        {/* ── Photo zone ── */}
        <View style={s.photoZone}>
          <Text style={s.photoPlaceholderText}>[ Cover Photo ]</Text>
          <Text style={s.photoPlaceholderNote}>Replace with editorial photo before final export</Text>
        </View>

        {/* ── Left sidebar over photo ── */}
        <View style={s.leftSidebar}>
          <Text style={s.exclusiveLabel}>Exclusive</Text>
          <View style={s.exclusiveLine} />
          <Text style={s.sidebarText}>
            {"Interview with\nthe founder of a\nEuropean tech\nacquisition firm"}
          </Text>
        </View>

        {/* ── Headline band ── */}
        <View style={s.headlineBand}>
          <Text style={s.headlineTitle}>{"Build to\nLast"}</Text>
          <Text style={s.headlineSub}>
            {"What separates the tech assets that transact from those that disappear\n— and what every European founder needs to know before the conversation starts."}
          </Text>
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
