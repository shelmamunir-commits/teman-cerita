import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'
import { MoodProvider } from './context/MoodContext.jsx'
import { JournalProvider } from './context/JournalContext.jsx'
import { SettingsProvider, useSettings } from './context/SettingsContext.jsx'
import { CommunityProvider } from './context/CommunityContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import FloatingChat from './components/layout/FloatingChat.jsx'
import Onboarding from './components/layout/Onboarding.jsx'

function MotionWrapper({ children }) {
  const { reduceMotion } = useSettings()
  return <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>{children}</MotionConfig>
}

function AccountDataProviders({ children }) {
  const { user } = useAuth()
  const accountKey = user?.id || 'guest'

  return (
    <AppProvider key={accountKey}>
      <ChatProvider>
        <MoodProvider>
          <JournalProvider>
            <CommunityProvider>{children}</CommunityProvider>
          </JournalProvider>
        </MoodProvider>
      </ChatProvider>
    </AppProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <ThemeProvider>
        <AuthProvider>
          <AccountDataProviders>
            <MotionWrapper>
              <HashRouter>
                <App />
                <FloatingChat />
                <Onboarding />
              </HashRouter>
            </MotionWrapper>
          </AccountDataProviders>
        </AuthProvider>
      </ThemeProvider>
    </SettingsProvider>
  </React.StrictMode>,
)
