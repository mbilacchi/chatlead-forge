import { useAuth } from '@/contexts/AuthContext'
import { useLogo } from '@/contexts/LogoContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, User, Building, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'
import LogoUploader from '@/components/LogoUploader'

const Settings = () => {
  const { user } = useAuth()
  const { logo, setLogo } = useLogo()

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as configurações da sua conta</p>
              </div>
            </div>
            {logo && (
              <div className="flex items-center space-x-3">
                <img 
                  src={logo} 
                  alt="Logo da empresa" 
                  className="h-8 w-auto max-w-[120px] object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações da Conta</span>
              </CardTitle>
              <CardDescription>
                Suas informações pessoais e de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Logo da Empresa</span>
              </CardTitle>
              <CardDescription>
                Configure a logo da sua empresa que aparecerá nas páginas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogoUploader 
                onLogoChange={setLogo}
                currentLogo={logo}
              />
            </CardContent>
          </Card>

          {/* Personalização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Personalização</span>
              </CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tema</p>
                    <p className="text-sm text-muted-foreground">Escolha entre tema claro ou escuro</p>
                  </div>
                  <Button variant="outline" disabled>
                    Em breve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Settings