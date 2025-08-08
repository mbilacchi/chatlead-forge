import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Download } from 'lucide-react';
import { Question } from '@/hooks/useLeadMagnets';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatPreviewProps {
  title: string;
  description: string;
  questions: Question[];
  primaryColor?: string;
  assistantName?: string;
}

const ChatPreview = ({ title, description, questions, primaryColor = '#8B5CF6', assistantName = 'Assistente' }: ChatPreviewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 = intro
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState<{ [questionId: string]: string | number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Reset preview when questions change
  useEffect(() => {
    setCurrentQuestionIndex(-1);
    setMessages([]);
    setUserInput('');
    setResponses({});
    setIsCompleted(false);
    setIsTyping(false);
    
    // Add intro message
    if (title) {
      const introMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `Olá! 👋 Eu sou o ${assistantName}! Bem-vindo(a)! Eu vou te ajudar a conseguir o "${title}". São apenas algumas perguntas rápidas e você terá acesso imediato ao material. Vamos começar?`,
        timestamp: new Date()
      };
      setMessages([introMessage]);
    }
  }, [title, questions]);

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
    if (questions.length === 0) return;
    
    setCurrentQuestionIndex(0);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage('bot', questions[0].question);
    }, 1000);
  };

  const handleUserResponse = (response: string | number) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Add user message
    addMessage('user', response.toString());
    
    // Store response
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));

    // Check if there are more questions
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserInput('');
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const nextQuestion = questions[currentQuestionIndex + 1];
        addMessage('bot', nextQuestion.question);
      }, 1000);
    } else {
      // Complete the form
      completeForm();
    }
  };

  const completeForm = () => {
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addMessage('bot', `Perfeito! 🎉 Muito obrigado pelas respostas. Seu "${title}" está pronto para download!`);
      setIsCompleted(true);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    let processedInput: string | number = userInput.trim();

    // Process scale input
    if (currentQuestion.type === 'scale') {
      const num = parseInt(processedInput);
      if (isNaN(num) || num < (currentQuestion.scaleMin || 1) || num > (currentQuestion.scaleMax || 10)) {
        return;
      }
      processedInput = num;
    }

    handleUserResponse(processedInput);
  };

  const handleMultipleChoice = (option: string) => {
    handleUserResponse(option);
  };

  const progress = currentQuestionIndex >= 0 && questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;

  const currentQuestion = currentQuestionIndex >= 0 && questions[currentQuestionIndex] ? questions[currentQuestionIndex] : null;

  return (
    <div className="h-full flex flex-col bg-gradient-hero">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Preview do Chat</span>
          
          {currentQuestionIndex >= 0 && questions.length > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground">
                {currentQuestionIndex + 1} de {questions.length}
              </span>
              <div className="w-20">
                <Progress value={progress} className="h-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 mb-4">
          {/* Lead Magnet Preview */}
          {currentQuestionIndex === -1 && title && (
            <Card className="bg-card/90 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <h2 className="text-lg font-bold text-foreground mb-2">
                  {title || 'Título do Lead Magnet'}
                </h2>
                <p className="text-muted-foreground mb-4 text-sm">
                  {description || 'Descrição do seu lead magnet...'}
                </p>
                <Button 
                  onClick={startConversation}
                  disabled={questions.length === 0}
                  className="bg-gradient-primary hover:opacity-90 text-white px-6 py-2 text-sm"
                >
                  {questions.length === 0 ? 'Adicione perguntas' : 'Começar Agora'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm text-sm ${
                  message.type === 'user'
                    ? 'bg-chat-user text-chat-user-foreground'
                    : 'bg-chat-bot text-chat-bot-foreground'
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-chat-bot text-chat-bot-foreground rounded-lg px-4 py-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentQuestion && !isCompleted && !isTyping && (
          <div className="space-y-3">
            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple-choice' && (
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleMultipleChoice(option)}
                    className="bg-card/90 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground transition-all text-left h-auto py-2 px-4 text-xs"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Scale Input */}
            {currentQuestion.type === 'scale' && (
              <div className="flex justify-center space-x-1 bg-card/90 backdrop-blur-sm rounded-lg p-3">
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
                        className="w-8 h-8 text-xs bg-card hover:bg-primary hover:text-primary-foreground"
                      >
                        {value}
                      </Button>
                    );
                  }
                )}
              </div>
            )}

            {/* Text/Email Input */}
            {(currentQuestion.type === 'text' || currentQuestion.type === 'email') && (
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={currentQuestion.placeholder || 'Digite sua resposta...'}
                  type={currentQuestion.type === 'email' ? 'email' : 'text'}
                  className="flex-1 bg-card/90 backdrop-blur-sm border-border/50 text-xs"
                />
                <Button 
                  type="submit" 
                  disabled={!userInput.trim()}
                  className="bg-gradient-primary hover:opacity-90 text-xs px-3"
                >
                  Enviar
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Completion */}
        {isCompleted && (
          <Card className="bg-card/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-2">
                Parabéns! 🎉
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Seu download está pronto. Você também receberá uma cópia por email.
              </p>
              <Button className="bg-gradient-success hover:opacity-90 text-white px-6 py-2 text-sm">
                <Download className="w-4 h-4 mr-2" />
                Baixar Agora
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatPreview;