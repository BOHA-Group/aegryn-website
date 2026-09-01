'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Trash2, Edit2, Save, X, Users, DollarSign } from 'lucide-react'

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
  salary_gross_annual: number | null
  salary_currency: string | null
  commission_percentage: number | null
  commission_amount_calculated: number | null
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})

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

  async function deleteItem(id: string, type: 'hiring' | 'candidate') {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return
    
    const table = type === 'hiring' ? 'talent_hiring_requests' : 'talent_candidates'
    await supabase.from(table).delete().eq('id', id)
    loadData()
  }

  async function saveEdit() {
    if (!editingId) return
    
    const table = activeTab === 'hiring' ? 'talent_hiring_requests' : 'talent_candidates'
    await supabase.from(table).update(editData).eq('id', editingId)
    setEditingId(null)
    setEditData({})
    loadData()
  }

  function startEdit(item: any) {
    setEditingId(item.id)
    setEditData(item)
  }

  function formatCurrency(amount: number | null, currency: string | null) {
    if (!amount) return '-'
    const curr = currency || 'CHF'
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: curr }).format(amount)
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
                {editingId === req.id ? (
                  /* Mode édition */
                  <div className="space-y-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-sans font-bold text-ag-black text-[17px]">Édition mandat</h3>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="p-2 bg-ag-apex text-white hover:bg-ag-apex/80">
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-ag-gray text-white hover:bg-ag-gray/80">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editData.role_title || ''}
                        onChange={(e) => setEditData({...editData, role_title: e.target.value})}
                        placeholder="Titre du poste"
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      />
                      <input
                        type="text"
                        value={editData.company || ''}
                        onChange={(e) => setEditData({...editData, company: e.target.value})}
                        placeholder="Entreprise"
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      />
                      <input
                        type="text"
                        value={editData.location || ''}
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                        placeholder="Localisation"
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      />
                      <select
                        value={editData.status || 'new'}
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      >
                        <option value="new">Nouveau</option>
                        <option value="in_progress">En cours</option>
                        <option value="placed">Placé</option>
                        <option value="closed">Fermé</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </div>

                    <div className="border-t border-ag-border pt-4 mt-4">
                      <h4 className="font-semibold text-[14px] mb-3 flex items-center gap-2">
                        <DollarSign size={16} /> Informations financières
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[12px] text-ag-gray block mb-1">Salaire brut annuel</label>
                          <input
                            type="number"
                            value={editData.salary_gross_annual || ''}
                            onChange={(e) => setEditData({...editData, salary_gross_annual: parseFloat(e.target.value) || null})}
                            placeholder="120000"
                            className="w-full px-3 py-2 border border-ag-border text-[13px]"
                          />
                        </div>
                        <div>
                          <label className="text-[12px] text-ag-gray block mb-1">Devise</label>
                          <select
                            value={editData.salary_currency || 'CHF'}
                            onChange={(e) => setEditData({...editData, salary_currency: e.target.value})}
                            className="w-full px-3 py-2 border border-ag-border text-[13px]"
                          >
                            <option value="CHF">CHF</option>
                            <option value="EUR">EUR</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[12px] text-ag-gray block mb-1">Commission (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editData.commission_percentage || ''}
                            onChange={(e) => setEditData({...editData, commission_percentage: parseFloat(e.target.value) || null})}
                            placeholder="20"
                            className="w-full px-3 py-2 border border-ag-border text-[13px]"
                          />
                        </div>
                      </div>
                      {editData.salary_gross_annual && editData.commission_percentage && (
                        <div className="mt-3 p-3 bg-ag-apex/10 border border-ag-apex/20">
                          <p className="text-[13px] font-semibold text-ag-black">
                            Commission calculée: {formatCurrency(
                              editData.salary_gross_annual * (editData.commission_percentage / 100),
                              editData.salary_currency
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[12px] text-ag-gray block mb-1">Notes internes</label>
                      <textarea
                        value={editData.notes || ''}
                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                        placeholder="Notes internes sur ce mandat..."
                        rows={3}
                        className="w-full px-3 py-2 border border-ag-border text-[13px]"
                      />
                    </div>
                  </div>
                ) : (
                  /* Mode lecture */
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-sans font-bold text-ag-black text-[17px] mb-1">
                          {req.role_title}
                        </h3>
                        <p className="text-[13px] text-ag-gray">
                          {req.company} • {req.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={req.status}
                          onChange={(e) => updateStatus(req.id, e.target.value, 'hiring')}
                          className="px-3 py-1.5 border border-ag-border text-[12px] font-semibold uppercase tracking-wider"
                        >
                          <option value="new">Nouveau</option>
                          <option value="in_progress">En cours</option>
                          <option value="placed">Placé</option>
                          <option value="closed">Fermé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        <button
                          onClick={() => startEdit(req)}
                          className="p-2 border border-ag-border hover:bg-ag-off-white"
                          title="Éditer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteItem(req.id, 'hiring')}
                          className="p-2 border border-red-300 text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-[13px] mb-4">
                      <div>
                        <span className="font-semibold">Contact:</span> {req.contact_name} ({req.email})
                      </div>
                      <div>
                        <span className="font-semibold">Téléphone:</span> {req.phone || 'Non renseigné'}
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

                    {(req.salary_gross_annual || req.commission_percentage) && (
                      <div className="border-t border-ag-border pt-4 mb-4">
                        <h4 className="font-semibold text-[13px] mb-2 flex items-center gap-2">
                          <DollarSign size={14} /> Financier
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4 text-[13px]">
                          {req.salary_gross_annual && (
                            <div>
                              <span className="font-semibold">Salaire brut:</span> {formatCurrency(req.salary_gross_annual, req.salary_currency)}
                            </div>
                          )}
                          {req.commission_percentage && (
                            <div>
                              <span className="font-semibold">Commission:</span> {req.commission_percentage}%
                            </div>
                          )}
                          {req.commission_amount_calculated && (
                            <div className="text-ag-apex font-semibold">
                              Montant: {formatCurrency(req.commission_amount_calculated, req.salary_currency)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {req.notes && (
                      <div className="border-t border-ag-border pt-4 mb-4">
                        <h4 className="font-semibold text-[13px] mb-2">Notes internes</h4>
                        <p className="text-[13px] text-ag-gray leading-relaxed whitespace-pre-wrap">
                          {req.notes}
                        </p>
                      </div>
                    )}

                    <details className="mt-4">
                      <summary className="cursor-pointer text-[12px] font-semibold text-ag-gray uppercase tracking-wider">
                        Description du poste
                      </summary>
                      <p className="mt-2 text-[13px] text-ag-gray leading-relaxed whitespace-pre-wrap">
                        {req.role_description}
                      </p>
                    </details>
                  </>
                )}
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
                {editingId === cand.id ? (
                  /* Mode édition candidat */
                  <div className="space-y-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-sans font-bold text-ag-black text-[17px]">Édition candidat</h3>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="p-2 bg-ag-apex text-white hover:bg-ag-apex/80">
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-ag-gray text-white hover:bg-ag-gray/80">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editData.full_name || ''}
                        onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                        placeholder="Nom complet"
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      />
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        placeholder="Email"
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      />
                      <input
                        type="text"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        placeholder="Téléphone"
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      />
                      <input
                        type="text"
                        value={editData.linkedin_url || ''}
                        onChange={(e) => setEditData({...editData, linkedin_url: e.target.value})}
                        placeholder="LinkedIn URL"
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      />
                      <input
                        type="text"
                        value={editData.availability || ''}
                        onChange={(e) => setEditData({...editData, availability: e.target.value})}
                        placeholder="Disponibilité"
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      />
                      <select
                        value={editData.status || 'new'}
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                        className="px-3 py-2 border border-ag-border text-[13px]"
                      >
                        <option value="new">Nouveau</option>
                        <option value="reviewed">Examiné</option>
                        <option value="shortlisted">Présélectionné</option>
                        <option value="placed">Placé</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[12px] text-ag-gray block mb-1">Notes internes</label>
                      <textarea
                        value={editData.notes || ''}
                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                        placeholder="Notes internes sur ce candidat..."
                        rows={3}
                        className="w-full px-3 py-2 border border-ag-border text-[13px]"
                      />
                    </div>
                  </div>
                ) : (
                  /* Mode lecture candidat */
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-sans font-bold text-ag-black text-[17px] mb-1">
                          {cand.full_name}
                        </h3>
                        <p className="text-[13px] text-ag-gray">
                          {cand.email} {cand.phone && `• ${cand.phone}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
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
                        <button
                          onClick={() => startEdit(cand)}
                          className="p-2 border border-ag-border hover:bg-ag-off-white"
                          title="Éditer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteItem(cand.id, 'candidate')}
                          className="p-2 border border-red-300 text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

                    {cand.notes && (
                      <div className="border-t border-ag-border pt-4 mb-4">
                        <h4 className="font-semibold text-[13px] mb-2">Notes internes</h4>
                        <p className="text-[13px] text-ag-gray leading-relaxed whitespace-pre-wrap">
                          {cand.notes}
                        </p>
                      </div>
                    )}

                    <details className="mt-4">
                      <summary className="cursor-pointer text-[12px] font-semibold text-ag-gray uppercase tracking-wider">
                        Lettre de motivation
                      </summary>
                      <p className="mt-2 text-[13px] text-ag-gray leading-relaxed whitespace-pre-wrap">
                        {cand.motivation}
                      </p>
                    </details>
                  </>
                )}
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
