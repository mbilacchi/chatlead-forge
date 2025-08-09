import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Upload, Image, X, Check } from 'lucide-react'

interface LogoUploaderProps {
  onLogoChange?: (logoUrl: string | null) => void
  currentLogo?: string | null
  className?: string
}

const LogoUploader = ({ onLogoChange, currentLogo, className = "" }: LogoUploaderProps) => {
  const [logo, setLogo] = useState<string | null>(currentLogo || null)
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  // Mock logos para demonstração
  const mockLogos = [
    '/lovable-uploads/0eca6909-1a0d-42b4-b25f-56cf870a9e18.png', // Wise Tech logo da imagem enviada
    'https://via.placeholder.com/150x60/355555/FFFFFF?text=EMPRESA+A',
    'https://via.placeholder.com/150x60/345555/FFFFFF?text=EMPRESA+B',
    'https://via.placeholder.com/150x60/335555/FFFFFF?text=EMPRESA+C',
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simular upload - em produção seria enviado para servidor
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogo(result)
        onLogoChange?.(result)
        toast({
          title: "Logo enviado com sucesso!",
          description: "Sua logo foi atualizada.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogo(result)
        onLogoChange?.(result)
        toast({
          title: "Logo enviado com sucesso!",
          description: "Sua logo foi atualizada.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const selectMockLogo = (logoUrl: string) => {
    setLogo(logoUrl)
    onLogoChange?.(logoUrl)
    toast({
      title: "Logo selecionada!",
      description: "Logo atualizada com sucesso.",
    })
  }

  const removeLogo = () => {
    setLogo(null)
    onLogoChange?.(null)
    toast({
      title: "Logo removida",
      description: "A logo foi removida com sucesso.",
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Logo da Empresa</Label>
        
        {/* Logo Preview */}
        {logo && (
          <Card className="relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={logo} 
                    alt="Logo da empresa" 
                    className="h-12 w-auto max-w-[150px] object-contain"
                  />
                  <Check className="h-4 w-4 text-success" />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeLogo}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Area */}
        <Card className={`transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed'}`}>
          <CardContent 
            className="p-6 text-center cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Envie sua logo</p>
                <p className="text-xs text-muted-foreground">
                  Arraste e solte ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG até 5MB
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="logo-upload"
              />
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Image className="h-4 w-4 mr-2" />
                Selecionar arquivo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mock Logos para demonstração */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Ou escolha uma logo de exemplo:</Label>
          <div className="grid grid-cols-2 gap-2">
            {mockLogos.map((logoUrl, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => selectMockLogo(logoUrl)}
              >
                <CardContent className="p-3">
                  <img 
                    src={logoUrl} 
                    alt={`Logo exemplo ${index + 1}`}
                    className="h-8 w-auto max-w-full object-contain mx-auto"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoUploader