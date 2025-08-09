import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LogoContextType {
  logo: string | null
  setLogo: (logo: string | null) => void
}

const LogoContext = createContext<LogoContextType | undefined>(undefined)

interface LogoProviderProps {
  children: ReactNode
}

export const LogoProvider = ({ children }: LogoProviderProps) => {
  const [logo, setLogoState] = useState<string | null>(null)

  useEffect(() => {
    // Carrega o logo do localStorage na inicialização
    const savedLogo = localStorage.getItem('company-logo')
    if (savedLogo) {
      setLogoState(savedLogo)
    }
  }, [])

  const setLogo = (newLogo: string | null) => {
    setLogoState(newLogo)
    if (newLogo) {
      localStorage.setItem('company-logo', newLogo)
    } else {
      localStorage.removeItem('company-logo')
    }
  }

  return (
    <LogoContext.Provider value={{ logo, setLogo }}>
      {children}
    </LogoContext.Provider>
  )
}

export const useLogo = () => {
  const context = useContext(LogoContext)
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider')
  }
  return context
}