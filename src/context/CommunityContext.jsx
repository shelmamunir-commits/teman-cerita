import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedPosts } from '../data/community'
import { useAuth } from './AuthContext.jsx'
import { userStorageKey } from '../lib/storage.js'

const CommunityContext = createContext(null)

export function CommunityProvider({ children }) {
  const { user } = useAuth()
  const [posts, setPosts] = useLocalStorage(
    userStorageKey('bridge_posts', user?.id),
    seedPosts(),
    Array.isArray,
  )

  const addPost = (post) => setPosts((p) => [{ id: 'u' + Date.now(), ...post, isUserEntry: true, likes: 0, replies: [] }, ...p])
  const addReply = (postId, reply) =>
    setPosts((p) => p.map((x) => (x.id === postId ? { ...x, replies: [...x.replies, reply] } : x)))
  const likePost = (postId) => setPosts((p) => p.map((x) => (x.id === postId ? { ...x, likes: x.likes + 1 } : x)))

  return <CommunityContext.Provider value={{ posts, addPost, addReply, likePost }}>{children}</CommunityContext.Provider>
}

export function useCommunity() {
  return useContext(CommunityContext)
}
