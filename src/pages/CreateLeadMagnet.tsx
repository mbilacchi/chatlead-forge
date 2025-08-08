import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeadMagnets, Question } from '@/hooks/useLeadMagnets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Upload, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatPreview from '@/components/ChatPreview';

const CreateLeadMagnet = () => {
  const navigate = useNavigate();
  const { createLeadMagnet } = useLeadMagnets();
  const { toast } = useToast();
  
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    primaryColor: '#8B5CF6'
  });

  const [questions, setQuestions] = useState<Question[]>([]);

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
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Add name and email questions if not present
    const finalQuestions = [
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
      },
      ...questions
    ];

    try {
      await createLeadMagnet({
        name: formData.name,
        title: formData.title,
        description: formData.description,
        primaryColor: formData.primaryColor,
        questions: finalQuestions,
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

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Criar Lead Magnet</h1>
                <p className="text-muted-foreground">Configure seu formulário conversacional</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Ocultar' : 'Preview'}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.name || !formData.title}
                className="bg-gradient-primary hover:opacity-90"
              >
                Criar Lead Magnet
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'} gap-8`}>
          {/* Form Section */}
          <div className="space-y-8">
            {/* Basic Info */}
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

            {/* Questions */}
            <Card className="bg-gradient-card shadow-lg">
              <CardHeader>
                <CardTitle>Perguntas Personalizadas</CardTitle>
                <CardDescription>
                  Configure perguntas adicionais (Nome e Email são incluídos automaticamente)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-foreground">Pergunta {index + 3}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de Pergunta</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value: Question['type']) => 
                            updateQuestion(index, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="multiple-choice">Múltipla Escolha</SelectItem>
                            <SelectItem value="scale">Escala</SelectItem>
                          </SelectContent>
                        </Select>
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

                {questions.length < 3 && (
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
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-8 h-fit">
              <Card className="h-[600px] overflow-hidden">
                <ChatPreview
                  title={formData.title}
                  description={formData.description}
                  questions={[
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
                    },
                    ...questions
                  ]}
                  primaryColor={formData.primaryColor}
                />
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateLeadMagnet;