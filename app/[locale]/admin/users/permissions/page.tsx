'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Shield, Check, X, Save, Search } from 'lucide-react'

type Permission = {
  id: string
  name: string
  description: string | null
  category: string
}

type User = {
  id: string
  email: string
  full_name: string | null
  role: string
  permission_count: number
  permission_summary: string
}

type UserPermission = {
  user_id: string
  permission_id: string
}

export default function AdminPermissionsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      loadUserPermissions(selectedUser)
    }
  }, [selectedUser])

  async function loadData() {
    setLoading(true)
    
    // Charger les utilisateurs avec résumé permissions
    const { data: usersData } = await supabase
      .from('user_permissions_summary')
      .select('*')
      .order('role', { ascending: true })
    
    if (usersData) setUsers(usersData)

    // Charger toutes les permissions disponibles
    const { data: permsData } = await supabase
      .from('admin_permissions')
      .select('*')
      .order('category, name')
    
    if (permsData) setPermissions(permsData)
    
    setLoading(false)
  }

  async function loadUserPermissions(userId: string) {
    const { data } = await supabase
      .from('user_admin_permissions')
      .select('user_id, permission_id')
      .eq('user_id', userId)
    
    if (data) setUserPermissions(data)
  }

  async function togglePermission(userId: string, permissionId: string, hasPermission: boolean) {
    setSaving(true)
    
    if (hasPermission) {
      // Retirer la permission
      await supabase
        .from('user_admin_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('permission_id', permissionId)
    } else {
      // Ajouter la permission
      await supabase
        .from('user_admin_permissions')
        .insert({
          user_id: userId,
          permission_id: permissionId
        })
    }
    
    await loadUserPermissions(userId)
    await loadData() // Recharger pour mettre à jour les compteurs
    setSaving(false)
  }

  function hasPermission(userId: string, permissionId: string): boolean {
    return userPermissions.some(
      up => up.user_id === userId && up.permission_id === permissionId
    )
  }

  const selectedUserData = users.find(u => u.id === selectedUser)
  const isFullAdmin = selectedUserData?.role === 'admin'

  // Grouper permissions par catégorie
  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = []
    acc[perm.category].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  const categories = Object.keys(permissionsByCategory)
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  )

  return (
    <div className="min-h-screen bg-ag-off-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sans font-bold text-ag-black text-[32px] tracking-[-0.02em] mb-2 flex items-center gap-3">
            <Shield size={32} className="text-ag-apex" />
            Gestion des Permissions Admin
          </h1>
          <p className="text-[14px] text-ag-gray">
            Attribuer des permissions granulaires aux utilisateurs internes
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Liste des utilisateurs */}
          <div className="bg-white border border-ag-border p-6">
            <div className="mb-4">
              <h2 className="font-sans font-bold text-ag-black text-[18px] mb-4">
                Utilisateurs
              </h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ag-gray" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-3 py-2 border border-ag-border text-[13px]"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-ag-gray text-[13px]">Chargement...</div>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`w-full text-left p-3 border transition-all ${
                      selectedUser === user.id
                        ? 'border-ag-apex bg-ag-apex/5'
                        : 'border-ag-border hover:border-ag-gray'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[13px] text-ag-black truncate">
                          {user.full_name || user.email}
                        </p>
                        <p className="text-[11px] text-ag-gray truncate">{user.email}</p>
                      </div>
                      <span className={`ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-ag-apex/20 text-ag-apex'
                          : 'bg-ag-gray/20 text-ag-gray'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-ag-gray">
                      <Shield size={12} />
                      <span>{user.permission_count} permission{user.permission_count > 1 ? 's' : ''}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Panneau de permissions */}
          <div className="bg-white border border-ag-border p-6">
            {!selectedUser ? (
              <div className="text-center py-20 text-ag-gray">
                <Shield size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-[14px]">Sélectionnez un utilisateur pour gérer ses permissions</p>
              </div>
            ) : (
              <>
                <div className="mb-6 pb-6 border-b border-ag-border">
                  <h2 className="font-sans font-bold text-ag-black text-[20px] mb-2">
                    {selectedUserData?.full_name || selectedUserData?.email}
                  </h2>
                  <p className="text-[13px] text-ag-gray mb-3">{selectedUserData?.email}</p>
                  
                  {isFullAdmin && (
                    <div className="p-3 bg-ag-apex/10 border border-ag-apex/20">
                      <p className="text-[13px] font-semibold text-ag-black flex items-center gap-2">
                        <Shield size={14} className="text-ag-apex" />
                        Administrateur complet - Toutes les permissions
                      </p>
                      <p className="text-[12px] text-ag-gray mt-1">
                        Cet utilisateur a accès à toutes les fonctionnalités admin sans restriction.
                      </p>
                    </div>
                  )}
                </div>

                {!isFullAdmin && (
                  <>
                    {/* Filtres par catégorie */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFilterCategory('all')}
                          className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                            filterCategory === 'all'
                              ? 'bg-ag-navy text-white'
                              : 'bg-ag-off-white text-ag-gray hover:text-ag-black'
                          }`}
                        >
                          Toutes
                        </button>
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                              filterCategory === cat
                                ? 'bg-ag-navy text-white'
                                : 'bg-ag-off-white text-ag-gray hover:text-ag-black'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Liste des permissions */}
                    <div className="space-y-6">
                      {Object.entries(permissionsByCategory)
                        .filter(([cat]) => filterCategory === 'all' || filterCategory === cat)
                        .map(([category, perms]) => (
                          <div key={category}>
                            <h3 className="font-sans font-bold text-ag-black text-[15px] mb-3 uppercase tracking-wider">
                              {category}
                            </h3>
                            <div className="space-y-2">
                              {perms.map((perm) => {
                                const hasPerm = hasPermission(selectedUser, perm.id)
                                return (
                                  <label
                                    key={perm.id}
                                    className={`flex items-start gap-3 p-3 border cursor-pointer transition-all ${
                                      hasPerm
                                        ? 'border-ag-apex bg-ag-apex/5'
                                        : 'border-ag-border hover:border-ag-gray'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={hasPerm}
                                      onChange={() => togglePermission(selectedUser, perm.id, hasPerm)}
                                      disabled={saving}
                                      className="mt-1 w-4 h-4 accent-ag-apex"
                                    />
                                    <div className="flex-1">
                                      <p className="font-semibold text-[13px] text-ag-black">
                                        {perm.name}
                                      </p>
                                      {perm.description && (
                                        <p className="text-[12px] text-ag-gray mt-0.5">
                                          {perm.description}
                                        </p>
                                      )}
                                      <p className="text-[11px] text-ag-gray/60 mt-1 font-mono">
                                        {perm.id}
                                      </p>
                                    </div>
                                    {hasPerm && (
                                      <Check size={16} className="text-ag-apex mt-1" />
                                    )}
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
