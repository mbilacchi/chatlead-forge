import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLeadMagnets } from '@/hooks/useLeadMagnets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye, Users, TrendingUp, Calendar } from 'lucide-react';

const Analytics = () => {
  const { id } = useParams();
  const { 
    getLeadMagnetById, 
    getLeadsByMagnetId, 
    getAnalyticsByMagnetId 
  } = useLeadMagnets();

  const leadMagnet = getLeadMagnetById(id!);
  const leads = getLeadsByMagnetId(id!);
  const analytics = getAnalyticsByMagnetId(id!);

  if (!leadMagnet) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Lead Magnet não encontrado</h1>
          <Link to="/dashboard">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Data de Completação', ...leadMagnet.questions.map(q => q.question)];
    const rows = leads.map(lead => [
      lead.name || '',
      lead.email,
      lead.completedAt.toLocaleDateString('pt-BR'),
      ...leadMagnet.questions.map(q => lead.responses[q.id] || '')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-${leadMagnet.name}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{leadMagnet.name}</h1>
                <p className="text-muted-foreground">Analytics e leads coletados</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link to={`/form/${leadMagnet.id}`}>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Formulário
                </Button>
              </Link>
              <Button onClick={exportCSV} disabled={leads.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Visualizações
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {analytics?.views || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de acessos à página
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Iniciados
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {analytics?.started || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Clicaram em "Começar"
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completados
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {analytics?.completed || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Finalizaram o formulário
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conversão
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {analytics?.conversionRate || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Completados / Iniciados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lead Magnet Info */}
        <Card className="bg-gradient-card shadow-md mb-8">
          <CardHeader>
            <CardTitle>Informações do Lead Magnet</CardTitle>
            <CardDescription>Configuração atual do formulário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Detalhes</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Título:</strong> {leadMagnet.title}</p>
                  <p><strong>Descrição:</strong> {leadMagnet.description}</p>
                  <p><strong>Criado em:</strong> {leadMagnet.createdAt.toLocaleDateString('pt-BR')}</p>
                  <p><strong>Link público:</strong> 
                    <Link 
                      to={`/form/${leadMagnet.id}`} 
                      className="text-primary hover:underline ml-1"
                    >
                      /form/{leadMagnet.id}
                    </Link>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Perguntas ({leadMagnet.questions.length})</h4>
                <div className="space-y-1">
                  {leadMagnet.questions.map((question, index) => (
                    <div key={question.id} className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground">{index + 1}.</span>
                      <span className="flex-1">{question.question}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.type}
                      </Badge>
                      {question.required && (
                        <Badge variant="secondary" className="text-xs">
                          obrigatória
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="bg-gradient-card shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Leads Coletados ({leads.length})</CardTitle>
                <CardDescription>
                  Todos os leads que completaram o formulário
                </CardDescription>
              </div>
              {leads.length > 0 && (
                <Button onClick={exportCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum lead coletado ainda
                </h3>
                <p className="text-muted-foreground mb-4">
                  Compartilhe o link do seu formulário para começar a capturar leads.
                </p>
                <Link to={`/form/${leadMagnet.id}`}>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Formulário
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Respostas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.name || 'N/A'}
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            {lead.completedAt.toLocaleDateString('pt-BR')} às{' '}
                            {lead.completedAt.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {leadMagnet.questions.slice(2).map((question) => {
                              const response = lead.responses[question.id];
                              if (!response) return null;
                              
                              return (
                                <div key={question.id} className="text-sm">
                                  <span className="text-muted-foreground">
                                    {question.question.length > 30 
                                      ? question.question.substring(0, 30) + '...'
                                      : question.question
                                    }:
                                  </span>
                                  <span className="ml-1 font-medium">
                                    {response.toString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;