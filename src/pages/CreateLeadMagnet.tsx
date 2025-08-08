import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeadMagnets, Question } from '@/hooks/useLeadMagnets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Trash2, Upload, Eye, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CreateLeadMagnet = () => {
  const navigate = useNavigate();
  const { createLeadMagnet } = useLeadMagnets();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    primaryColor: '#8B5CF6',
    pdfFile: null as File | null
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'name',
      type: 'text' as const,
      question: 'Qual é o seu nome?',
      required: true,
      placeholder: 'Digite seu nome completo'
    },
    {
      id: 'email',
      type: 'email' as const,
      question: 'Qual é o seu melhor email?',
      required: true,
      placeholder: 'seu@email.com'
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setFormData({ ...formData, pdfFile: file });
      } else {
        toast({
          title: "Erro no arquivo",
          description: "Por favor, selecione um arquivo PDF de até 10MB.",
          variant: "destructive"
        });
      }
    }
  };

  const addQuestion = () => {
    if (questions.length >= 5) {
      toast({
        title: "Limite atingido",
        description: "Máximo de 5 perguntas permitidas no MVP.",
        variant: "destructive"
      });
      return;
    }

    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type: 'text',
      question: '',
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 2) {
      toast({
        title: "Não é possível remover",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      await createLeadMagnet({
        name: formData.name,
        title: formData.title,
        description: formData.description,
        primaryColor: formData.primaryColor,
        pdfFile: formData.pdfFile,
        questions,
        logo: ''
      });

      toast({
        title: "Sucesso!",
        description: "Lead magnet criado com sucesso.",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar lead magnet. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.title && formData.description;
      case 2:
        return formData.pdfFile;
      case 3:
        return questions.every(q => q.question.trim());
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Criar Novo Lead Magnet</h1>
              <p className="text-muted-foreground">Configure seu formulário conversacional</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Etapa {step} de 4</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="bg-gradient-card shadow-lg">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Configure as informações principais do seu lead magnet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto (interno)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Guia de Marketing Digital"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título do Lead Magnet</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: 10 Estratégias de Marketing que Aumentam Vendas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o valor que seu lead magnet oferece..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Cor Primária</Label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    id="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-border"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#8B5CF6"
                    className="w-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: PDF Upload */}
        {step === 2 && (
          <Card className="bg-gradient-card shadow-lg">
            <CardHeader>
              <CardTitle>Upload do Lead Magnet</CardTitle>
              <CardDescription>
                Faça upload do arquivo PDF que será entregue aos leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {formData.pdfFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{formData.pdfFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setFormData({ ...formData, pdfFile: null })}
                    >
                      Remover arquivo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Selecione seu arquivo PDF</p>
                      <p className="text-sm text-muted-foreground">Máximo 10MB</p>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <Label htmlFor="pdf-upload">
                        <Button asChild className="cursor-pointer">
                          <span>Escolher arquivo</span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Questions */}
        {step === 3 && (
          <Card className="bg-gradient-card shadow-lg">
            <CardHeader>
              <CardTitle>Configurar Perguntas</CardTitle>
              <CardDescription>
                Configure as perguntas do seu formulário conversacional (máximo 5)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-foreground">Pergunta {index + 1}</h4>
                    {index >= 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Pergunta</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value: Question['type']) => 
                          updateQuestion(index, { type: value })
                        }
                        disabled={index < 2} // Name and email are fixed
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="multiple-choice">Múltipla Escolha</SelectItem>
                          <SelectItem value="scale">Escala</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={question.required}
                        onCheckedChange={(checked) => 
                          updateQuestion(index, { required: checked })
                        }
                        disabled={index < 2} // Name and email are required
                      />
                      <Label>Obrigatória</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pergunta</Label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(index, { question: e.target.value })}
                      placeholder="Digite sua pergunta..."
                    />
                  </div>

                  {question.type === 'text' && (
                    <div className="space-y-2">
                      <Label>Placeholder</Label>
                      <Input
                        value={question.placeholder || ''}
                        onChange={(e) => updateQuestion(index, { placeholder: e.target.value })}
                        placeholder="Texto de exemplo..."
                      />
                    </div>
                  )}

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      <Label>Opções (máximo 4)</Label>
                      {(question.options || ['']).map((option, optionIndex) => (
                        <Input
                          key={optionIndex}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(question.options || [''])];
                            newOptions[optionIndex] = e.target.value;
                            updateQuestion(index, { options: newOptions });
                          }}
                          placeholder={`Opção ${optionIndex + 1}`}
                        />
                      ))}
                      {(question.options?.length || 0) < 4 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = [...(question.options || []), ''];
                            updateQuestion(index, { options: newOptions });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Opção
                        </Button>
                      )}
                    </div>
                  )}

                  {question.type === 'scale' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Valor Mínimo</Label>
                        <Input
                          type="number"
                          value={question.scaleMin || 1}
                          onChange={(e) => updateQuestion(index, { scaleMin: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Máximo</Label>
                        <Input
                          type="number"
                          value={question.scaleMax || 10}
                          onChange={(e) => updateQuestion(index, { scaleMax: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {questions.length < 5 && (
                <Button
                  variant="outline"
                  onClick={addQuestion}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preview & Publish */}
        {step === 4 && (
          <Card className="bg-gradient-card shadow-lg">
            <CardHeader>
              <CardTitle>Revisão Final</CardTitle>
              <CardDescription>
                Revise todas as configurações antes de publicar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Informações Básicas</h4>
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <p><strong>Nome:</strong> {formData.name}</p>
                    <p><strong>Título:</strong> {formData.title}</p>
                    <p><strong>Descrição:</strong> {formData.description}</p>
                    <p><strong>Arquivo:</strong> {formData.pdfFile?.name || 'Não selecionado'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Perguntas ({questions.length})</h4>
                  <div className="space-y-2">
                    {questions.map((q, index) => (
                      <div key={q.id} className="bg-muted rounded-lg p-3">
                        <p className="font-medium">{index + 1}. {q.question}</p>
                        <p className="text-sm text-muted-foreground">
                          Tipo: {q.type} | {q.required ? 'Obrigatória' : 'Opcional'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Anterior
          </Button>

          <div className="flex space-x-2">
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-gradient-primary hover:opacity-90"
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Publicar Lead Magnet
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateLeadMagnet;