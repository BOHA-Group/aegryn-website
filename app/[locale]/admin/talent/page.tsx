'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type HiringRequest = {
  id: string
  created_at: string
  company: string
  contact_name: string
  email: string
  phone: string | null
  role_title: string
  role_description: string
  location: string
  budget_annual_chf: string | null
  urgency: string
  status: string
  notes: string | null
}

type Candidate = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string | null
  linkedin_url: string | null
  motivation: string
  availability: string | null
  status: string
  notes: string | null
}

export default function AdminTalentPage() {
  const [activeTab, setActiveTab] = useState<'hiring' | 'candidates'>('hiring')
  const [hiringRequests, setHiringRequests] = useState<HiringRequest[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [activeTab])

  async function loadData() {
    setLoading(true)
    
    if (activeTab === 'hiring') {
      const { data, error } = await supabase
        .from('talent_hiring_requests')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) setHiringRequests(data)
    } else {
      const { data, error } = await supabase
        .from('talent_candidates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) setCandidates(data)
    }
    
    setLoading(false)
  }

  async function updateStatus(id: string, status: string, type: 'hiring' | 'candidate') {
    const table = type === 'hiring' ? 'talent_hiring_requests' : 'talent_candidates'
    await supabase.from(table).update({ status }).eq('id', id)
    loadData()
  }

  return (
    <div className="min-h-screen bg-ag-off-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sans font-bold text-ag-black text-[32px] tracking-[-0.02em] mb-2">
            Talent Management
          </h1>
          <p className="text-[14px] text-ag-gray">
            Gestion des mandats de recrutement et candidatures
          </p>
        </div>

        {/* Toggle */}
        <div className="inline-flex border border-ag-border bg-white mb-8">
          <button
            onClick={() => setActiveTab('hiring')}
            className={`px-6 py-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase transition-all ${
              activeTab === 'hiring'
                ? 'bg-ag-navy text-white'
                : 'bg-white text-ag-gray hover:text-ag-black'
            }`}
          >
            Mandats ({hiringRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase transition-all border-l border-ag-border ${
              activeTab === 'candidates'
                ? 'bg-ag-navy text-white'
                : 'bg-white text-ag-gray hover:text-ag-black'
            }`}
          >
            Candidats ({candidates.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-ag-gray">Chargement...</div>
        ) : activeTab === 'hiring' ? (
          <div className="space-y-4">
            {hiringRequests.map((req) => (
              <div key={req.id} className="bg-white border border-ag-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-sans font-bold text-ag-black text-[17px] mb-1">
                      {req.role_title}
                    </h3>
                    <p className="text-[13px] text-ag-gray">
                      {req.company} • {req.location}
                    </p>
                  </div>
                  <select
                    value={req.status}
                    onChange={(e) => updateStatus(req.id, e.target.value, 'hiring')}
                    className="px-3 py-1.5 border border-ag-border text-[12px] font-semibold uppercase tracking-wider"
                  >
                    <option value="new">Nouveau</option>
                    <option value="in_progress">En cours</option>
                    <option value="placed">Placé</option>
                    <option value="closed">Fermé</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="font-semibold">Contact:</span> {req.contact_name} ({req.email})
                  </div>
                  <div>
                    <span className="font-semibold">Budget:</span> {req.budget_annual_chf || 'Non spécifié'}
                  </div>
                  <div>
                    <span className="font-semibold">Urgence:</span> {req.urgency}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {new Date(req.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer text-[12px] font-semibold text-ag-gray uppercase tracking-wider">
                    Description du poste
                  </summary>
                  <p className="mt-2 text-[13px] text-ag-gray leading-relaxed whitespace-pre-wrap">
                    {req.role_description}
                  </p>
                </details>
              </div>
            ))}
            {hiringRequests.length === 0 && (
              <div className="text-center py-12 text-ag-gray">Aucun mandat</div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((cand) => (
              <div key={cand.id} className="bg-white border border-ag-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-sans font-bold text-ag-black text-[17px] mb-1">
                      {cand.full_name}
                    </h3>
                    <p className="text-[13px] text-ag-gray">
                      {cand.email} {cand.phone && `• ${cand.phone}`}
                    </p>
                  </div>
                  <select
                    value={cand.status}
                    onChange={(e) => updateStatus(cand.id, e.target.value, 'candidate')}
                    className="px-3 py-1.5 border border-ag-border text-[12px] font-semibold uppercase tracking-wider"
                  >
                    <option value="new">Nouveau</option>
                    <option value="reviewed">Examiné</option>
                    <option value="shortlisted">Présélectionné</option>
                    <option value="placed">Placé</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-[13px] mb-4">
                  {cand.linkedin_url && (
                    <div>
                      <span className="font-semibold">LinkedIn:</span>{' '}
                      <a href={cand.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-ag-apex hover:underline">
                        Profil
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Disponibilité:</span> {cand.availability || 'Non spécifiée'}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {new Date(cand.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer text-[12px] font-semibold text-ag-gray uppercase tracking-wider">
                    Lettre de motivation
                  </summary>
                  <p className="mt-2 text-[13px] text-ag-gray leading-relaxed whitespace-pre-wrap">
                    {cand.motivation}
                  </p>
                </details>
              </div>
            ))}
            {candidates.length === 0 && (
              <div className="text-center py-12 text-ag-gray">Aucun candidat</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
