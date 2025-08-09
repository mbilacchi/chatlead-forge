import { useLogo } from '@/contexts/LogoContext'

interface LogoDisplayProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const LogoDisplay = ({ className = "", size = 'md' }: LogoDisplayProps) => {
  const { logo } = useLogo()

  if (!logo) return null

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  }

  return (
    <img 
      src={logo} 
      alt="Logo da empresa" 
      className={`w-auto max-w-[150px] object-contain ${sizeClasses[size]} ${className}`}
    />
  )
}

export default LogoDisplay