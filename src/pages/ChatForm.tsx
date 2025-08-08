import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeadMagnets, Question } from '@/hooks/useLeadMagnets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Download, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const ChatForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLeadMagnetById, submitLead, trackView, trackStart } = useLeadMagnets();
  const { toast } = useToast();

  const [leadMagnet, setLeadMagnet] = useState(getLeadMagnetById(id!));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 = intro
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState<{ [questionId: string]: string | number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!leadMagnet) {
      navigate('/404');
      return;
    }

    // Track view
    trackView(leadMagnet.id);

    // Add intro message
    const introMessage: ChatMessage = {
      id: '1',
      type: 'bot',
      content: `Olá! 👋 Bem-vindo(a)! Eu vou te ajudar a conseguir o "${leadMagnet.title}". São apenas algumas perguntas rápidas e você terá acesso imediato ao material. Vamos começar?`,
      timestamp: new Date()
    };

    setMessages([introMessage]);
  }, []);

  const addMessage = (type: 'bot' | 'user', content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
  };

  const startConversation = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackStart(leadMagnet!.id);
    }
    
    setCurrentQuestionIndex(0);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage('bot', leadMagnet!.questions[0].question);
    }, 1000);
  };

  const handleUserResponse = (response: string | number) => {
    const currentQuestion = leadMagnet!.questions[currentQuestionIndex];
    
    // Add user message
    addMessage('user', response.toString());
    
    // Store response
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));

    // Check if there are more questions
    if (currentQuestionIndex < leadMagnet!.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserInput('');
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const nextQuestion = leadMagnet!.questions[currentQuestionIndex + 1];
        addMessage('bot', nextQuestion.question);
      }, 1000);
    } else {
      // Complete the form
      completeForm();
    }
  };

  const completeForm = async () => {
    setUserInput('');
    setIsTyping(true);

    // Get email and name from responses
    const emailResponse = responses[leadMagnet!.questions.find(q => q.type === 'email')?.id || ''] as string;
    const nameResponse = responses[leadMagnet!.questions.find(q => q.type === 'text')?.id || ''] as string;

    const finalResponses = {
      ...responses,
      email: emailResponse,
      name: nameResponse
    };

    try {
      await submitLead(leadMagnet!.id, finalResponses);
      
      setTimeout(() => {
        setIsTyping(false);
        addMessage('bot', `Perfeito, ${nameResponse}! 🎉 Muito obrigado pelas respostas. Seu "${leadMagnet!.title}" está pronto para download!`);
        setIsCompleted(true);
      }, 1500);

      toast({
        title: "Sucesso!",
        description: "Suas respostas foram registradas com sucesso!",
      });
    } catch (error) {
      setIsTyping(false);
      addMessage('bot', 'Ops! Ocorreu um erro. Tente novamente.');
      toast({
        title: "Erro",
        description: "Erro ao processar suas respostas. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    const currentQuestion = leadMagnet!.questions[currentQuestionIndex];
    let processedInput: string | number = userInput.trim();

    // Validate email
    if (currentQuestion.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(processedInput)) {
        toast({
          title: "Email inválido",
          description: "Por favor, digite um email válido.",
          variant: "destructive"
        });
        return;
      }
    }

    // Process scale input
    if (currentQuestion.type === 'scale') {
      const num = parseInt(processedInput);
      if (isNaN(num) || num < (currentQuestion.scaleMin || 1) || num > (currentQuestion.scaleMax || 10)) {
        toast({
          title: "Valor inválido",
          description: `Por favor, digite um número entre ${currentQuestion.scaleMin || 1} e ${currentQuestion.scaleMax || 10}.`,
          variant: "destructive"
        });
        return;
      }
      processedInput = num;
    }

    handleUserResponse(processedInput);
  };

  const handleMultipleChoice = (option: string) => {
    handleUserResponse(option);
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      // Remove last bot and user messages
      setMessages(prev => prev.slice(0, -2));
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      // Remove last response
      const currentQuestion = leadMagnet!.questions[currentQuestionIndex];
      const newResponses = { ...responses };
      delete newResponses[currentQuestion.id];
      setResponses(newResponses);
      
      setUserInput('');
    }
  };

  if (!leadMagnet) {
    return <div>Lead magnet não encontrado</div>;
  }

  const progress = currentQuestionIndex >= 0 
    ? ((currentQuestionIndex + 1) / leadMagnet.questions.length) * 100 
    : 0;

  const currentQuestion = currentQuestionIndex >= 0 ? leadMagnet.questions[currentQuestionIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sair
            </Button>
            
            {currentQuestionIndex >= 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {currentQuestionIndex + 1} de {leadMagnet.questions.length}
                </span>
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="space-y-6 mb-8">
          {/* Lead Magnet Preview */}
          {currentQuestionIndex === -1 && (
            <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {leadMagnet.title}
                </h1>
                <p className="text-muted-foreground mb-6 text-lg">
                  {leadMagnet.description}
                </p>
                <Button 
                  onClick={startConversation}
                  className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3 text-lg shadow-glow"
                >
                  Começar Agora
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} chat-enter`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-md ${
                  message.type === 'user'
                    ? 'bg-chat-user text-chat-user-foreground'
                    : 'bg-chat-bot text-chat-bot-foreground'
                }`}
              >
                <p className="text-sm md:text-base">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-chat-bot text-chat-bot-foreground rounded-2xl px-6 py-4 shadow-md">
                <div className="chat-typing">
                  <span>Digitando</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentQuestion && !isCompleted && !isTyping && (
          <div className="space-y-4">
            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple-choice' && (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleMultipleChoice(option)}
                    className="bg-card/90 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground transition-all text-left h-auto py-4 px-6"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Scale Input */}
            {currentQuestion.type === 'scale' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-card/90 backdrop-blur-sm rounded-lg p-4">
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion.scaleMin || 1}
                  </span>
                  <div className="flex space-x-2">
                    {Array.from(
                      { length: (currentQuestion.scaleMax || 10) - (currentQuestion.scaleMin || 1) + 1 },
                      (_, i) => {
                        const value = (currentQuestion.scaleMin || 1) + i;
                        return (
                          <Button
                            key={value}
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserResponse(value)}
                            className="w-10 h-10 bg-card hover:bg-primary hover:text-primary-foreground"
                          >
                            {value}
                          </Button>
                        );
                      }
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion.scaleMax || 10}
                  </span>
                </div>
              </div>
            )}

            {/* Text/Email Input */}
            {(currentQuestion.type === 'text' || currentQuestion.type === 'email') && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={currentQuestion.placeholder || 'Digite sua resposta...'}
                    type={currentQuestion.type === 'email' ? 'email' : 'text'}
                    className="flex-1 bg-card/90 backdrop-blur-sm border-border/50"
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    disabled={!userInput.trim()}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    Enviar
                  </Button>
                </div>
              </form>
            )}

            {/* Back Button */}
            {currentQuestionIndex > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Completion */}
        {isCompleted && (
          <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Parabéns! 🎉
              </h2>
              <p className="text-muted-foreground mb-6">
                Seu download está pronto. Você também receberá uma cópia por email.
              </p>
              <Button className="bg-gradient-success hover:opacity-90 text-white px-8 py-3 text-lg">
                <Download className="w-5 h-5 mr-2" />
                Baixar Agora
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatForm;