import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import { PERMISSIONS } from './lib/permissions.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const ResultInput = lazy(() => import('./pages/ResultInput.jsx'))
const Understand = lazy(() => import('./pages/Understand.jsx'))
const Personalize = lazy(() => import('./pages/Personalize.jsx'))
const Pathway = lazy(() => import('./pages/Pathway.jsx'))
const Actions = lazy(() => import('./pages/Actions.jsx'))
const Breathing = lazy(() => import('./pages/Breathing.jsx'))
const Meditation = lazy(() => import('./pages/Meditation.jsx'))
const Help = lazy(() => import('./pages/Help.jsx'))
const Safety = lazy(() => import('./pages/Safety.jsx'))
const Wellbeing = lazy(() => import('./pages/Wellbeing.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Students = lazy(() => import('./pages/Students.jsx'))
const Screening = lazy(() => import('./pages/Screening.jsx'))
const Quiz = lazy(() => import('./pages/Quiz.jsx'))
const Articles = lazy(() => import('./pages/Articles.jsx'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail.jsx'))
const HelpFriend = lazy(() => import('./pages/HelpFriend.jsx'))
const Community = lazy(() => import('./pages/Community.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Chat = lazy(() => import('./pages/Chat.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const ChangePassword = lazy(() => import('./pages/ChangePassword.jsx'))
const Sysadmin = lazy(() => import('./pages/Sysadmin.jsx'))
const ScreeningHistory = lazy(() => import('./pages/ScreeningHistory.jsx'))
const AccessDenied = lazy(() => import('./pages/AccessDenied.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-slate-500">Memuat halaman…</div>}><Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/akses-ditolak" element={<ProtectedRoute><AccessDenied /></ProtectedRoute>} />
        <Route path="/ganti-sandi" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute permission={PERMISSIONS.SCREENING_CREATE_SELF}><ResultInput /></ProtectedRoute>} />
        <Route path="/understand" element={<ProtectedRoute permission={PERMISSIONS.SCREENING_READ_SELF}><Understand /></ProtectedRoute>} />
        <Route path="/personalize" element={<ProtectedRoute permission={PERMISSIONS.WELLBEING_USE_SELF}><Personalize /></ProtectedRoute>} />
        <Route path="/pathway" element={<ProtectedRoute permission={PERMISSIONS.WELLBEING_USE_SELF}><Pathway /></ProtectedRoute>} />
        <Route path="/actions" element={<ProtectedRoute permission={PERMISSIONS.WELLBEING_USE_SELF}><Actions /></ProtectedRoute>} />
        <Route path="/breathing" element={<Breathing />} />
        <Route path="/meditasi" element={<Meditation />} />
        <Route path="/help" element={<Help />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/jurnal" element={<ProtectedRoute permission={PERMISSIONS.WELLBEING_USE_SELF}><Wellbeing /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute permission={PERMISSIONS.WELLBEING_USE_SELF}><Navigate to="/jurnal" replace /></ProtectedRoute>} />
        <Route path="/mood" element={<Navigate to="/jurnal?tab=tren" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute permission={PERMISSIONS.DASHBOARD_READ_ALL}><Dashboard /></ProtectedRoute>} />
        <Route path="/data-santri" element={<ProtectedRoute permission={PERMISSIONS.STUDENTS_READ}><Students /></ProtectedRoute>} />
        <Route path="/sysadmin" element={<ProtectedRoute permissions={[PERMISSIONS.USERS_READ, PERMISSIONS.ROLES_MANAGE, PERMISSIONS.USERS_IMPORT, PERMISSIONS.AUDIT_READ]}><Sysadmin /></ProtectedRoute>} />
        <Route path="/riwayat-skrining" element={<ProtectedRoute permission={PERMISSIONS.SCREENING_READ_SELF}><ScreeningHistory /></ProtectedRoute>} />
        <Route path="/screening" element={<ProtectedRoute permission={PERMISSIONS.SCREENING_CREATE_SELF}><Screening /></ProtectedRoute>} />
        <Route path="/quiz/:quizId" element={<ProtectedRoute permission={PERMISSIONS.SCREENING_CREATE_SELF}><Quiz /></ProtectedRoute>} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/bantu-teman" element={<HelpFriend />} />
        <Route path="/komunitas" element={<ProtectedRoute permission={PERMISSIONS.WELLBEING_USE_SELF}><Community /></ProtectedRoute>} />
        <Route path="/pengaturan" element={<Settings />} />
        <Route path="/privasi" element={<Privacy />} />
        <Route path="/chat" element={<ProtectedRoute permission={PERMISSIONS.WELLBEING_USE_SELF}><Chat /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes></Suspense>
  )
}
