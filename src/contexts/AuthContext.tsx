import { createContext, useContext, useEffect, useState } from 'react'

// Mock user type for testing
interface MockUser {
  id: string
  email: string
}

interface AuthContextType {
  user: MockUser | null
  session: any
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved user (mock persistence)
    const savedUser = localStorage.getItem('mockUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setSession({ user: userData })
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string) => {
    // Mock signup - simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate success (in real app, this would create account)
    console.log('Mock signup successful for:', email)
  }

  const signIn = async (email: string, password: string) => {
    // Mock signin - simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simple mock validation
    if (email === 'admin@test.com' && password === '123456') {
      const mockUser = { id: '1', email: email }
      setUser(mockUser)
      setSession({ user: mockUser })
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
    } else {
      throw new Error('Email ou senha incorretos. Use admin@test.com / 123456 para testar.')
    }
  }

  const signOut = async () => {
    // Mock signout
    await new Promise(resolve => setTimeout(resolve, 500))
    setUser(null)
    setSession(null)
    localStorage.removeItem('mockUser')
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}