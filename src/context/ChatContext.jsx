import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { chatReply } from '../engine/chatEngine'
import { useApp } from './AppContext.jsx'

const INITIAL = [
  {
    role: 'bot',
    text: 'Halo! Aku Teman Cerita, asisten virtual dari Pesma Nur Alannur. Aku bisa bantu menjelaskan hasil skrining, menyarankan latihan menenangkan diri, atau mengarahkanmu ke bantuan.',
    actions: [
      { label: 'Apa arti hasil skriningku?', reply: 'hasil' },
      { label: 'Aku lagi cemas', reply: 'cemas' },
      { label: 'Aku susah tidur', reply: 'tidur' },
    ],
  },
]

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const { result } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useLocalStorage('bridge_chat', INITIAL)
  const [typing, setTyping] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    setMessages((items) => items
      .map((message) => ({
        ...message,
        text: message.text?.replaceAll('BRIDGE-AI', 'Teman Cerita'),
      }))
      .slice(-100))
    return () => clearTimeout(timer.current)
    // Migrasi ringan untuk percakapan yang tersimpan sebelum rebranding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const send = (text) => {
    const clean = (text || '').trim()
    if (!clean || typing) return
    setMessages((m) => [...m.slice(-98), { role: 'user', text: clean }])
    setTyping(true)
    const reply = chatReply(clean, { category: result?.category })
    timer.current = setTimeout(() => {
      setMessages((m) => [...m.slice(-98), { role: 'bot', ...reply }])
      setTyping(false)
    }, 650)
  }

  const value = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((o) => !o),
    messages,
    typing,
    send,
    clear: () => {
      clearTimeout(timer.current)
      setTyping(false)
      setMessages(INITIAL)
    },
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  return useContext(ChatContext)
}
