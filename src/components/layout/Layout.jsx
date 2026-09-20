import { Outlet } from 'react-router-dom'
import Topbar from './Topbar.jsx'
import Footer from './Footer.jsx'
import StepsBar from './StepsBar.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-900/20" />
        <div className="absolute top-[32rem] -right-36 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/20" />
        <div className="absolute bottom-24 left-1/4 h-72 w-72 rounded-full bg-lime-100/35 blur-3xl dark:bg-emerald-950/20" />
      </div>
      <Topbar />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 2xl:px-16 py-6 sm:py-10">
        <StepsBar />
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
