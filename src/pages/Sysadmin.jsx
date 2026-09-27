import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CircleCheck, Download, FileUp, KeyRound, Plus, RefreshCw, Shield, UserCog, Users } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { invokeAuthenticatedFunction, supabase } from '../lib/supabase'
import { PERMISSION_LABELS } from '../lib/permissions'
import { PERMISSIONS } from '../lib/permissions'
import { cn } from '../lib/cn'
import { useAuth } from '../context/AuthContext'

const TABS = [
  { id: 'users', label: 'Pengguna', icon: Users, permissions: [PERMISSIONS.USERS_READ] },
  { id: 'roles', label: 'Role & akses', icon: Shield, permissions: [PERMISSIONS.ROLES_READ, PERMISSIONS.ROLES_MANAGE] },
  { id: 'import', label: 'Impor CSV', icon: FileUp, permissions: [PERMISSIONS.USERS_IMPORT] },
  { id: 'audit', label: 'Audit', icon: UserCog, permissions: [PERMISSIONS.AUDIT_READ] },
]

const emptyUser = { login_id: '', full_name: '', class_name: '', role_id: '' }

async function adminAction(action, payload = {}) {
  return invokeAuthenticatedFunction('admin-api', { action, ...payload })
}

export default function Sysadmin() {
  const { hasPermission, user: currentUser } = useAuth()
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [audit, setAudit] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userModal, setUserModal] = useState(false)
  const [roleModal, setRoleModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editingRole, setEditingRole] = useState(null)
  const [credentials, setCredentials] = useState([])
  const [pendingReset, setPendingReset] = useState(null)
  const [notice, setNotice] = useState('')
  const visibleTabs = useMemo(() => TABS.filter((item) => item.permissions.some(hasPermission)), [hasPermission])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const [userResult, roleResult, permissionResult, auditResult] = await Promise.all([
      hasPermission(PERMISSIONS.USERS_READ) ? supabase.from('profiles').select('id, login_id, full_name, class_name, status, role_id, created_at, roles(name, system_key)').order('full_name') : Promise.resolve({ data: [] }),
      (hasPermission(PERMISSIONS.ROLES_READ) || hasPermission(PERMISSIONS.ROLES_MANAGE) || hasPermission(PERMISSIONS.USERS_CREATE) || hasPermission(PERMISSIONS.USERS_IMPORT)) ? supabase.from('roles').select('id, name, system_key, is_system, role_permissions(permission_id)').order('is_system', { ascending: false }).order('name') : Promise.resolve({ data: [] }),
      (hasPermission(PERMISSIONS.ROLES_READ) || hasPermission(PERMISSIONS.ROLES_MANAGE)) ? supabase.from('permissions').select('id, key, description').order('key') : Promise.resolve({ data: [] }),
      hasPermission(PERMISSIONS.AUDIT_READ) ? supabase.from('audit_logs').select('id, action, target_type, target_id, details, created_at, actor:profiles!audit_logs_actor_id_fkey(full_name)').order('created_at', { ascending: false }).limit(100) : Promise.resolve({ data: [] }),
    ])
    const firstError = [userResult, roleResult, permissionResult, auditResult].find((result) => result.error)?.error
    if (firstError) setError(firstError.message)
    setUsers(userResult.data || [])
    setRoles(roleResult.data || [])
    setPermissions(permissionResult.data || [])
    setAudit(auditResult.data || [])
    setLoading(false)
  }, [hasPermission])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (!visibleTabs.some((item) => item.id === tab) && visibleTabs[0]) setTab(visibleTabs[0].id) }, [tab, visibleTabs])

  const openNewUser = () => { setEditingUser(emptyUser); setUserModal(true) }
  const openEditUser = (user) => { setEditingUser(user); setUserModal(true) }
  const resetPassword = async () => {
    if (!pendingReset) return
    setError('')
    try {
      const result = await adminAction('reset-password', { user_id: pendingReset.id })
      setPendingReset(null)
      setCredentials([{ login_id: pendingReset.login_id, temporary_password: result.temporary_password }])
      setNotice(`Sandi sementara untuk ${pendingReset.full_name} berhasil dibuat.`)
      await load()
    } catch (err) {
      setPendingReset(null)
      setError(err.message)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengelolaan sistem</h1><p className="mt-1 text-sm text-slate-500">Kelola akun, role, impor, dan jejak perubahan.</p></div>
        <Button variant="secondary" onClick={load} disabled={loading}><RefreshCw size={16} /> Muat ulang</Button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {visibleTabs.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={cn('inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold', tab === item.id ? 'bg-brand text-white' : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300')}><item.icon size={15} /> {item.label}</button>)}
      </div>

      {hasPermission(PERMISSIONS.USERS_READ) && <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[['Total pengguna', users.length], ['Akun aktif', users.filter((item) => item.status === 'active').length], ['Akun nonaktif', users.filter((item) => item.status !== 'active').length], ['Role tersedia', roles.length]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"><div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div><div className="mt-1 text-xs font-semibold text-slate-500">{label}</div></div>)}
      </div>}

      {error && <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</div>}
      {notice && <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><CircleCheck size={17} /> {notice}<button onClick={() => setNotice('')} className="ml-auto font-bold" aria-label="Tutup pemberitahuan">×</button></div>}
      {loading ? <div className="py-16 text-center text-sm text-slate-500">Memuat data…</div> : (
        <>
          {tab === 'users' && <UsersPanel users={users} roles={roles} currentUserId={currentUser?.id} canAdd={hasPermission(PERMISSIONS.USERS_CREATE) && hasPermission(PERMISSIONS.ROLES_ASSIGN)} canEdit={hasPermission(PERMISSIONS.USERS_UPDATE)} canReset={hasPermission(PERMISSIONS.USERS_RESET_PASSWORD)} onAdd={openNewUser} onEdit={openEditUser} onReset={setPendingReset} />}
          {tab === 'roles' && <RolesPanel roles={roles} permissions={permissions} canManage={hasPermission(PERMISSIONS.ROLES_MANAGE)} onAdd={() => { setEditingRole({ name: '', permission_ids: [] }); setRoleModal(true) }} onEdit={(role) => { setEditingRole({ ...role, permission_ids: role.role_permissions.map((item) => item.permission_id) }); setRoleModal(true) }} />}
          {tab === 'import' && <ImportPanel roles={roles} onImported={(rows) => { setCredentials(rows); load() }} setError={setError} />}
          {tab === 'audit' && <AuditPanel rows={audit} />}
        </>
      )}

      <UserForm open={userModal} user={editingUser} currentUserId={currentUser?.id} roles={roles} onClose={() => setUserModal(false)} onSaved={async (result) => { setUserModal(false); setNotice(editingUser?.id ? 'Data pengguna berhasil diperbarui.' : 'Pengguna baru berhasil dibuat.'); if (result?.temporary_password) setCredentials([{ login_id: result.login_id, temporary_password: result.temporary_password }]); await load() }} />
      <RoleForm open={roleModal} role={editingRole} permissions={permissions} onClose={() => setRoleModal(false)} onSaved={async () => { setRoleModal(false); setNotice('Role dan permission berhasil disimpan.'); await load() }} />
      <Modal open={Boolean(pendingReset)} onClose={() => setPendingReset(null)} title="Reset sandi pengguna?">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">Sandi lama <b>{pendingReset?.full_name}</b> akan langsung tidak berlaku. Pengguna akan memperoleh sandi sementara baru dan wajib menggantinya saat login.</p>
        <div className="mt-5 flex gap-3"><Button variant="secondary" onClick={() => setPendingReset(null)} className="flex-1">Batal</Button><Button onClick={resetPassword} className="flex-1"><KeyRound size={16} /> Reset sandi</Button></div>
      </Modal>
      <CredentialsModal rows={credentials} onClose={() => setCredentials([])} />
    </motion.div>
  )
}

function UsersPanel({ users, roles, currentUserId, onAdd, onEdit, onReset, canAdd, canEdit, canReset }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [role, setRole] = useState('all')
  const filtered = users
    .filter((user) => status === 'all' || user.status === status)
    .filter((user) => role === 'all' || user.role_id === role)
    .filter((user) => `${user.login_id} ${user.full_name} ${user.class_name || ''}`.toLowerCase().includes(query.toLowerCase()))
  return <Card className="mt-4 overflow-hidden p-0">
    <div className="border-b border-slate-200 p-4 dark:border-slate-700"><div className="flex flex-col gap-3 sm:flex-row"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari ID, nama, atau kelas…" className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />{canAdd && <Button onClick={onAdd}><Plus size={16} /> Tambah pengguna</Button>}</div><div className="mt-3 flex flex-wrap items-center gap-2"><select aria-label="Filter status pengguna" value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select><select aria-label="Filter role pengguna" value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"><option value="all">Semua role</option>{roles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><span className="ml-auto text-xs text-slate-500">{filtered.length} pengguna</span></div></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900"><tr><th className="px-4 py-3">Pengguna</th><th className="px-4 py-3">Kelas</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3"><b className="block text-slate-900 dark:text-white">{user.full_name}</b><span className="text-xs text-slate-500">{user.login_id}</span></td><td className="px-4 py-3">{user.class_name || '—'}</td><td className="px-4 py-3">{user.roles?.name}</td><td className="px-4 py-3"><span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600')}>{user.status === 'active' ? 'Aktif' : 'Nonaktif'}</span></td><td className="px-4 py-3"><div className="flex gap-2">{canEdit && <button className="font-bold text-brand-deep dark:text-brand" onClick={() => onEdit(user)}>Edit</button>}{canReset && user.id !== currentUserId && <button aria-label={`Reset sandi ${user.full_name}`} className="font-bold text-amber-700 dark:text-amber-400" onClick={() => onReset(user)}><KeyRound size={15} /></button>}</div></td></tr>)}</tbody></table></div>
    {!filtered.length && <p className="p-8 text-center text-sm text-slate-400">Tidak ada pengguna.</p>}
  </Card>
}

function RolesPanel({ roles, permissions, onAdd, onEdit, canManage }) {
  return <div className="mt-4">{canManage && <div className="flex justify-end"><Button onClick={onAdd}><Plus size={16} /> Role baru</Button></div>}<div className="mt-4 grid gap-4 md:grid-cols-2">{roles.map((role) => <Card key={role.id}><div className="flex items-start justify-between"><div><h3 className="font-bold text-slate-900 dark:text-white">{role.name}</h3><p className="mt-1 text-xs text-slate-500">{role.role_permissions.length} permission · {role.is_system ? 'Role bawaan' : 'Role kustom'}</p></div>{(canManage || role.is_system) && <button onClick={() => onEdit(role)} className="text-sm font-bold text-brand-deep dark:text-brand">{role.is_system ? 'Lihat' : 'Edit'}</button>}</div><div className="mt-3 flex flex-wrap gap-1.5">{role.role_permissions.slice(0, 5).map((grant) => { const permission = permissions.find((item) => item.id === grant.permission_id); return permission ? <span key={grant.permission_id} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600 dark:bg-slate-900 dark:text-slate-300">{PERMISSION_LABELS[permission.key] || permission.key}</span> : null })}{role.role_permissions.length > 5 && <span className="text-xs text-slate-400">+{role.role_permissions.length - 5}</span>}</div></Card>)}</div></div>
}

function UserForm({ open, user, currentUserId, roles, onClose, onSaved }) {
  const [form, setForm] = useState(emptyUser)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  useEffect(() => { setForm(user || emptyUser); setError(''); setConfirmDeactivate(false) }, [user, open])
  const editingSelf = Boolean(user?.id && user.id === currentUserId)
  const deactivating = user?.status === 'active' && form.status === 'inactive'
  const save = async (event) => { event.preventDefault(); if (deactivating && !confirmDeactivate) return setError('Konfirmasikan penonaktifan akun terlebih dahulu.'); setBusy(true); setError(''); try { const result = await adminAction(user?.id ? 'update-user' : 'create-user', user?.id ? { user_id: user.id, profile: form } : { profile: form }); onSaved(result) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <Modal open={open} onClose={onClose} title={user?.id ? 'Edit pengguna' : 'Tambah pengguna'}><form onSubmit={save} className="space-y-4">{[['login_id', 'ID pengguna'], ['full_name', 'Nama lengkap'], ['class_name', 'Kelas / kelompok']].map(([key, label]) => <label key={key} className="block text-sm font-semibold">{label}<input disabled={key === 'login_id' && user?.id} minLength={key === 'class_name' ? undefined : key === 'login_id' ? 3 : 2} maxLength={key === 'login_id' ? 50 : key === 'full_name' ? 120 : 80} value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal dark:border-slate-700 dark:bg-slate-900" /></label>)}<label className="block text-sm font-semibold">Role<select disabled={editingSelf} value={form.role_id || ''} onChange={(e) => setForm({ ...form, role_id: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"><option value="">Pilih role</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>{user?.id && <label className="flex items-center gap-2 text-sm"><input disabled={editingSelf} type="checkbox" checked={form.status === 'active'} onChange={(e) => { setForm({ ...form, status: e.target.checked ? 'active' : 'inactive' }); setConfirmDeactivate(false) }} /> Akun aktif</label>}{editingSelf && <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">Role dan status akun yang sedang digunakan hanya dapat diubah oleh Sysadmin lain.</p>}{deactivating && <label className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"><input type="checkbox" checked={confirmDeactivate} onChange={(e) => setConfirmDeactivate(e.target.checked)} className="mt-0.5" /> Saya memahami pengguna akan langsung kehilangan akses ke aplikasi.</label>}{error && <p role="alert" className="text-sm text-rose-600">{error}</p>}<Button type="submit" disabled={busy || !form.login_id.trim() || !form.full_name.trim() || !form.role_id || (deactivating && !confirmDeactivate)} className="w-full">{busy ? 'Menyimpan…' : 'Simpan'}</Button></form></Modal>
}

function RoleForm({ open, role, permissions, onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', permission_ids: [] })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { setForm(role || { name: '', permission_ids: [] }); setError(''); setBusy(false) }, [role, open])
  const locked = Boolean(role?.is_system)
  const toggle = (id) => setForm((current) => ({ ...current, permission_ids: current.permission_ids.includes(id) ? current.permission_ids.filter((item) => item !== id) : [...current.permission_ids, id] }))
  const save = async (event) => { event.preventDefault(); if (locked) return onClose(); setBusy(true); setError(''); try { await adminAction(role?.id ? 'update-role' : 'create-role', { role_id: role?.id, role: form }); onSaved() } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <Modal open={open} onClose={onClose} title={locked ? 'Permission role bawaan' : role?.id ? 'Edit role' : 'Role baru'}><form onSubmit={save}><label className="block text-sm font-semibold">Nama role<input disabled={locked} minLength={2} maxLength={80} value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900" /></label><div className="mt-5 space-y-2">{permissions.map((permission) => <label key={permission.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 text-sm dark:border-slate-700"><input disabled={locked} type="checkbox" checked={form.permission_ids.includes(permission.id)} onChange={() => toggle(permission.id)} className="mt-0.5" /><span><b className="block">{PERMISSION_LABELS[permission.key] || permission.key}</b><span className="text-xs text-slate-500">{permission.key}</span></span></label>)}</div>{error && <p className="mt-3 text-sm text-rose-600">{error}</p>}<Button type="submit" disabled={busy || (!locked && form.name.trim().length < 2)} className="mt-5 w-full">{locked ? 'Tutup' : busy ? 'Menyimpan…' : 'Simpan role'}</Button></form></Modal>
}

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false
  for (let i = 0; i < text.length; i += 1) { const char = text[i]; if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i += 1 } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { row.push(cell.trim()); cell = '' } else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && text[i + 1] === '\n') i += 1; row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = '' } else cell += char }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row)
  if (rows.length < 2) return []
  const headers = rows[0].map((value) => value.toLowerCase().replace(/^\ufeff/, ''))
  return rows.slice(1).map((values, index) => Object.fromEntries([...headers.map((header, col) => [header, values[col] || '']), ['_row', index + 2]]))
}

function ImportPanel({ roles, onImported, setError }) {
  const [rows, setRows] = useState([])
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState([])
  const roleNames = useMemo(() => new Set(roles.map((role) => role.name.toLowerCase())), [roles])
  const issues = rows.flatMap((row) => { const found = []; if (!row.id_santri) found.push(`Baris ${row._row}: id_santri kosong`); if (!row.nama_lengkap) found.push(`Baris ${row._row}: nama_lengkap kosong`); if (row.role && !roleNames.has(row.role.toLowerCase())) found.push(`Baris ${row._row}: role tidak dikenal`); return found })
  const pick = async (event) => { const file = event.target.files?.[0]; if (!file) return; setResults([]); setRows(parseCsv(await file.text())) }
  const importRows = async () => { setBusy(true); setError(''); try { const result = await adminAction('import-users', { rows }); setResults(result.results || []); onImported(result.credentials || []); setRows([]) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  const template = () => downloadCsv('template-import-pengguna.csv', [['id_santri', 'nama_lengkap', 'kelas', 'role'], ['SNT-001', 'Nama Santri', 'Kelas A', 'Santri']])
  return <Card className="mt-4"><h2 className="font-bold text-slate-900 dark:text-white">Impor daftar pengguna</h2><p className="mt-2 text-sm text-slate-500">Gunakan CSV UTF-8. Kolom wajib: <b>id_santri</b> dan <b>nama_lengkap</b>. Role kosong menjadi Santri.</p><div className="mt-4 flex flex-wrap gap-3"><Button variant="secondary" onClick={template}><Download size={16} /> Unduh template</Button><label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"><FileUp size={16} /> Pilih CSV<input type="file" accept=".csv,text/csv" onChange={pick} className="hidden" /></label></div>{rows.length > 0 && <div className="mt-5"><div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-900"><b>{rows.length}</b> baris siap diperiksa. {issues.length ? <span className="text-rose-600">Ada {issues.length} masalah.</span> : <span className="text-emerald-600">Validasi awal berhasil.</span>}</div>{issues.length > 0 && <ul className="mt-3 space-y-1 text-xs text-rose-600">{issues.slice(0, 20).map((issue) => <li key={issue}>• {issue}</li>)}</ul>}<Button onClick={importRows} disabled={busy || issues.length > 0} className="mt-4">{busy ? 'Mengimpor…' : `Impor ${rows.length} pengguna`}</Button></div>}{results.length > 0 && <div className="mt-5 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700"><b>Hasil impor: {results.filter((item) => item.status === 'created').length} berhasil, {results.filter((item) => item.status === 'failed').length} gagal.</b>{results.some((item) => item.status === 'failed') && <ul className="mt-3 space-y-1 text-xs text-rose-600">{results.filter((item) => item.status === 'failed').map((item) => <li key={item.row}>• Baris {item.row}: {item.error}</li>)}</ul>}</div>}</Card>
}

function AuditPanel({ rows }) { return <Card className="mt-4 p-0"><div className="divide-y divide-slate-100 dark:divide-slate-800">{rows.map((row) => <div key={row.id} className="p-4 text-sm"><div className="flex justify-between gap-4"><b className="text-slate-900 dark:text-white">{row.action}</b><time className="text-xs text-slate-400">{new Date(row.created_at).toLocaleString('id-ID')}</time></div><p className="mt-1 text-xs text-slate-500">Oleh {row.actor?.full_name || 'Sistem'} · {row.target_type} {row.target_id || ''}</p></div>)}{!rows.length && <p className="p-8 text-center text-sm text-slate-400">Belum ada aktivitas.</p>}</div></Card> }

function downloadCsv(filename, rows) { const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'); const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url) }

function CredentialsModal({ rows, onClose }) { return <Modal open={rows.length > 0} onClose={onClose} title="Sandi sementara"><p className="text-sm text-amber-700 dark:text-amber-300">Unduh sekarang. Sandi ini tidak dapat ditampilkan kembali.</p><div className="mt-4 max-h-64 overflow-auto rounded-xl bg-slate-50 p-3 font-mono text-xs dark:bg-slate-900">{rows.map((row) => <div key={row.login_id} className="flex justify-between gap-4 py-1"><span>{row.login_id}</span><b>{row.temporary_password}</b></div>)}</div><Button className="mt-4 w-full" onClick={() => downloadCsv('akun-sementara.csv', [['id_pengguna', 'sandi_sementara'], ...rows.map((row) => [row.login_id, row.temporary_password])])}><Download size={16} /> Unduh CSV</Button></Modal> }
