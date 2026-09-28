import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, permission, permissions }) {
  const location = useLocation()
  const { user, profile, loading, hasPermission } = useAuth()

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-500">Memuat akun…</div>
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (profile.status !== 'active') return <Navigate to="/akses-ditolak" replace state={{ reason: 'Akun Anda sedang dinonaktifkan.' }} />
  if (profile.must_change_password && location.pathname !== '/ganti-sandi') {
    return <Navigate to="/ganti-sandi" replace />
  }
  if (profile.roles?.system_key === 'student' && !profile.profile_completed_at && !['/profil', '/ganti-sandi'].includes(location.pathname)) {
    return <Navigate to="/profil?lengkapi=1" replace />
  }
  if (permission && !hasPermission(permission)) return <Navigate to="/akses-ditolak" replace state={{ from: location.pathname }} />
  if (permissions?.length && !permissions.some(hasPermission)) return <Navigate to="/akses-ditolak" replace state={{ from: location.pathname }} />

  return children
}
