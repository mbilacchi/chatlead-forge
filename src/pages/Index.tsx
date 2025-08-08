import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard on app load
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-card">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
