import { useState } from 'react';
import { useLeadMagnets } from '@/hooks/useLeadMagnets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BarChart3, Users, Eye, Download, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { leadMagnets, analytics, getAnalyticsByMagnetId, loading } = useLeadMagnets();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lead Magnet Chat</h1>
              <p className="text-muted-foreground mt-1">Crie formulários conversacionais que convertem</p>
            </div>
            <Link to="/create">
              <Button className="bg-gradient-primary hover:opacity-90 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Criar Lead Magnet
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Lead Magnets
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{leadMagnets.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Visualizações
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {analytics.reduce((total, a) => total + a.views, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {analytics.reduce((total, a) => total + a.completed, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conversão Média
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {analytics.length > 0 
                  ? Math.round(analytics.reduce((total, a) => total + a.conversionRate, 0) / analytics.length)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Magnets List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Seus Lead Magnets</h2>
          </div>

          {leadMagnets.length === 0 ? (
            <Card className="bg-gradient-card shadow-md">
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum Lead Magnet criado ainda
                </h3>
                <p className="text-muted-foreground mb-6">
                  Crie seu primeiro formulário conversacional e comece a capturar leads de forma mais eficaz.
                </p>
                <Link to="/create">
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Lead Magnet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {leadMagnets.map((leadMagnet) => {
                const stats = getAnalyticsByMagnetId(leadMagnet.id);
                return (
                  <Card key={leadMagnet.id} className="bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-foreground mb-2">
                            {leadMagnet.name}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {leadMagnet.title}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Stats */}
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-muted-foreground">
                            <Eye className="w-4 h-4 inline mr-1" />
                            {stats?.views || 0} visualizações
                          </span>
                          <span className="text-muted-foreground">
                            <Users className="w-4 h-4 inline mr-1" />
                            {stats?.completed || 0} leads
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-accent-light text-accent">
                          {stats?.conversionRate || 0}% conversão
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Link to={`/form/${leadMagnet.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Ver Formulário
                          </Button>
                        </Link>
                        <Link to={`/analytics/${leadMagnet.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </Button>
                        </Link>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Criado em {leadMagnet.createdAt.toLocaleDateString('pt-BR')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;