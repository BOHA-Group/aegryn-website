import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Permission = {
  permission_id: string
  permission_name: string
  permission_description: string | null
  category: string
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [isFullAdmin, setIsFullAdmin] = useState(false)

  useEffect(() => {
    loadPermissions()
  }, [])

  async function loadPermissions() {
    try {
      // Vérifier si l'utilisateur est admin full
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        setIsFullAdmin(true)
        setLoading(false)
        return
      }

      // Charger les permissions spécifiques
      const { data } = await supabase
        .rpc('get_user_permissions', { p_user_id: user.id })

      if (data) {
        setPermissions(data)
      }
    } catch (error) {
      console.error('Error loading permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  function hasPermission(permissionId: string): boolean {
    if (isFullAdmin) return true
    return permissions.some(p => p.permission_id === permissionId)
  }

  function hasAnyPermission(permissionIds: string[]): boolean {
    if (isFullAdmin) return true
    return permissionIds.some(id => hasPermission(id))
  }

  function hasAllPermissions(permissionIds: string[]): boolean {
    if (isFullAdmin) return true
    return permissionIds.every(id => hasPermission(id))
  }

  function canAccessTalent(): boolean {
    return hasAnyPermission(['talent.view', 'talent.edit', 'talent.delete'])
  }

  function canEditTalent(): boolean {
    return hasPermission('talent.edit')
  }

  function canDeleteTalent(): boolean {
    return hasPermission('talent.delete')
  }

  function canViewTalentFinancials(): boolean {
    return hasPermission('talent.view_financials')
  }

  function canEditTalentFinancials(): boolean {
    return hasPermission('talent.edit_financials')
  }

  return {
    permissions,
    loading,
    isFullAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    // Helpers spécifiques Talent
    canAccessTalent,
    canEditTalent,
    canDeleteTalent,
    canViewTalentFinancials,
    canEditTalentFinancials,
  }
}
