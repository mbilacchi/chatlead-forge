import { useState, useEffect } from 'react';

export interface Question {
  id: string;
  type: 'text' | 'email' | 'multiple-choice' | 'scale';
  question: string;
  required: boolean;
  options?: string[]; // For multiple choice
  scaleMin?: number; // For scale
  scaleMax?: number; // For scale
  placeholder?: string;
}

export interface LeadMagnet {
  id: string;
  name: string;
  title: string;
  description: string;
  pdfFile?: File | null;
  pdfUrl?: string;
  questions: Question[];
  primaryColor: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  leadMagnetId: string;
  name?: string;
  email: string;
  responses: { [questionId: string]: string | number };
  completedAt: Date;
  source: string;
}

export interface Analytics {
  leadMagnetId: string;
  views: number;
  started: number;
  completed: number;
  conversionRate: number;
}

// Mock data
const mockLeadMagnets: LeadMagnet[] = [
  {
    id: '1',
    name: 'Guia de Marketing Digital',
    title: '10 Estratégias de Marketing Digital que Aumentam Vendas em 30 Dias',
    description: 'Descubra as estratégias mais eficazes para transformar seu marketing digital e acelerar suas vendas.',
    pdfUrl: '/mock-guide.pdf',
    primaryColor: '#8B5CF6',
    questions: [
      {
        id: 'q1',
        type: 'text',
        question: 'Qual é o seu nome?',
        required: true,
        placeholder: 'Digite seu nome completo'
      },
      {
        id: 'q2',
        type: 'email',
        question: 'Qual é o seu melhor email?',
        required: true,
        placeholder: 'seu@email.com'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Qual é o seu maior desafio em marketing digital?',
        required: true,
        options: [
          'Gerar mais leads qualificados',
          'Aumentar conversões',
          'Melhorar ROI das campanhas',
          'Criar conteúdo que engaja'
        ]
      },
      {
        id: 'q4',
        type: 'scale',
        question: 'Em uma escala de 1 a 10, qual seu nível de experiência em marketing digital?',
        required: true,
        scaleMin: 1,
        scaleMax: 10
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

const mockLeads: Lead[] = [
  {
    id: '1',
    leadMagnetId: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    responses: {
      'q1': 'João Silva',
      'q2': 'joao@email.com',
      'q3': 'Gerar mais leads qualificados',
      'q4': 7
    },
    completedAt: new Date('2024-01-16'),
    source: 'direct'
  },
  {
    id: '2',
    leadMagnetId: '1',
    name: 'Maria Santos',
    email: 'maria@email.com',
    responses: {
      'q1': 'Maria Santos',
      'q2': 'maria@email.com',
      'q3': 'Aumentar conversões',
      'q4': 5
    },
    completedAt: new Date('2024-01-17'),
    source: 'social'
  }
];

const mockAnalytics: Analytics[] = [
  {
    leadMagnetId: '1',
    views: 150,
    started: 89,
    completed: 42,
    conversionRate: 28
  }
];

export const useLeadMagnets = () => {
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeadMagnets(mockLeadMagnets);
      setLeads(mockLeads);
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 500);
  }, []);

  const createLeadMagnet = async (data: Omit<LeadMagnet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLeadMagnet: LeadMagnet = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setLeadMagnets(prev => [...prev, newLeadMagnet]);
    return newLeadMagnet;
  };

  const updateLeadMagnet = async (id: string, data: Partial<LeadMagnet>) => {
    setLeadMagnets(prev => 
      prev.map(lm => 
        lm.id === id 
          ? { ...lm, ...data, updatedAt: new Date() }
          : lm
      )
    );
  };

  const deleteLeadMagnet = async (id: string) => {
    setLeadMagnets(prev => prev.filter(lm => lm.id !== id));
    setLeads(prev => prev.filter(lead => lead.leadMagnetId !== id));
  };

  const submitLead = async (leadMagnetId: string, responses: { [questionId: string]: string | number }) => {
    const leadMagnet = leadMagnets.find(lm => lm.id === leadMagnetId);
    if (!leadMagnet) throw new Error('Lead magnet not found');

    const newLead: Lead = {
      id: Date.now().toString(),
      leadMagnetId,
      email: responses['email'] as string || '',
      name: responses['name'] as string || '',
      responses,
      completedAt: new Date(),
      source: 'direct'
    };

    setLeads(prev => [...prev, newLead]);
    
    // Update analytics
    setAnalytics(prev => 
      prev.map(a => 
        a.leadMagnetId === leadMagnetId
          ? { 
              ...a, 
              completed: a.completed + 1,
              conversionRate: Math.round(((a.completed + 1) / a.started) * 100)
            }
          : a
      )
    );

    return newLead;
  };

  const trackView = async (leadMagnetId: string) => {
    setAnalytics(prev => 
      prev.map(a => 
        a.leadMagnetId === leadMagnetId
          ? { ...a, views: a.views + 1 }
          : a
      )
    );
  };

  const trackStart = async (leadMagnetId: string) => {
    setAnalytics(prev => 
      prev.map(a => 
        a.leadMagnetId === leadMagnetId
          ? { 
              ...a, 
              started: a.started + 1,
              conversionRate: Math.round((a.completed / (a.started + 1)) * 100)
            }
          : a
      )
    );
  };

  const getLeadMagnetById = (id: string) => {
    return leadMagnets.find(lm => lm.id === id);
  };

  const getLeadsByMagnetId = (leadMagnetId: string) => {
    return leads.filter(lead => lead.leadMagnetId === leadMagnetId);
  };

  const getAnalyticsByMagnetId = (leadMagnetId: string) => {
    return analytics.find(a => a.leadMagnetId === leadMagnetId);
  };

  return {
    leadMagnets,
    leads,
    analytics,
    loading,
    createLeadMagnet,
    updateLeadMagnet,
    deleteLeadMagnet,
    submitLead,
    trackView,
    trackStart,
    getLeadMagnetById,
    getLeadsByMagnetId,
    getAnalyticsByMagnetId
  };
};