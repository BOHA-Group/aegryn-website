#!/usr/bin/env python3
"""Generate talent pillars i18n content for EN, DE, ES, IT, NL"""

import json

# EN - English
talent_en = {
    "meta": {
        "title": "Executive Recruitment | Aegryn Talent",
        "desc": "We place the leaders who transform companies: board members, tech executives and M&A executives. Specialized executive search."
    },
    "hero": {
        "label": "Aegryn Talent",
        "title": "Executive recruitment\\nBoard · Tech · M&A",
        "desc1": "We place the leaders who transform companies: board members (CEO, COO, CTO, CIO, CHRO), tech executives and M&A executives.",
        "desc2": "Operators, not HR consultants. Success fee only. 3-month guarantee.",
        "quote": "Switzerland & Europe • 30 countries • 23 industries\\nResponse within 48h"
    },
    "pillars": {
        "board": {
            "title": "Board Members & C-Level",
            "desc": "We place board members and executives who define strategy and drive transformation.",
            "profiles": [
                {"label": "CEO & Managing Director", "desc": "Strategic leaders capable of driving vision, growth and company transformation."},
                {"label": "COO & Chief Operating Officer", "desc": "Experts in operational excellence, scaling, process optimization and strategic execution."},
                {"label": "CTO & Chief Technology Officer", "desc": "Tech visionaries capable of defining architecture, innovation and technology roadmap."},
                {"label": "CIO & Chief Information Officer", "desc": "Leaders of digital transformation, IT infrastructure, governance and systems modernization."},
                {"label": "CHRO & Chief Human Resources Officer", "desc": "Architects of HR strategy, company culture, talent acquisition and organizational development."},
                {"label": "CFO & Chief Financial Officer", "desc": "Experts in financial strategy, fundraising, M&A, management control and financial optimization."}
            ]
        },
        "executiveTech": {
            "title": "Executive Tech",
            "desc": "We place technical leaders who drive innovation, security, data and AI.",
            "profiles": [
                {"label": "Chief AI Officer & VP AI", "desc": "Leaders in artificial intelligence, machine learning, GenAI, data-driven strategy and AI transformation."},
                {"label": "CISO & VP Security", "desc": "Experts in cybersecurity, GDPR compliance, risk management, resilience and governance."},
                {"label": "Chief Data Officer & VP Data", "desc": "Architects of data strategy: data engineering, analytics, governance, monetization and data culture."},
                {"label": "Chief Product Officer & VP Product", "desc": "Tech product visionaries: roadmap, discovery, growth, product-led growth and go-to-market strategy."},
                {"label": "VP Engineering & Engineering Director", "desc": "Technical team leaders: scaling, engineering culture, delivery, architecture and operational excellence."},
                {"label": "VP Infrastructure & Head of Platform", "desc": "IT infrastructure leaders, cloud, DevOps, SRE, legacy modernization and developer experience."}
            ]
        },
        "executiveMA": {
            "title": "Executive M&A",
            "desc": "We place leaders specialized in mergers & acquisitions, due diligence and post-merger integration.",
            "profiles": [
                {"label": "VP M&A & Head of Corporate Development", "desc": "Experts in M&A strategy, deal sourcing, transaction structuring and acquisition execution."},
                {"label": "M&A Director & Transaction Lead", "desc": "Transaction leaders: valuation, negotiation, financial and legal due diligence, closing."},
                {"label": "Head of Integration (PMI)", "desc": "Post-merger integration specialists: synergies, process harmonization, change management."},
                {"label": "VP Strategy & Corporate Strategy Director", "desc": "Corporate strategy architects: inorganic growth, strategic partnerships, portfolio management."}
            ]
        }
    }
}

print(json.dumps(talent_en, indent=2, ensure_ascii=False))
