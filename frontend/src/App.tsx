import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import CommunityPage from './pages/CommunityPage';
import SoloSeekerPage from './pages/SoloSeekerPage';
import AdminProofReview from './pages/AdminProofReview';
import AIChat from './components/AIChat';

type AppView = 'landing' | 'auth';

function AppRouter() {
  const { user, isAuthenticated } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Not logged in: show landing or auth
  if (!isAuthenticated) {
    if (view === 'auth') {
      return (
        <AuthPage
          initialTab={authTab}
          onBack={() => setView('landing')}
        />
      );
    }
    return (
      <LandingPage
        onLoginClick={(tab = 'register') => {
          setAuthTab(tab);
          setView('auth');
        }}
      />
    );
  }

  const renderContent = () => {
    if (activeTab === 'community') return <CommunityPage />;
    if (activeTab === 'solo-seeker') return <SoloSeekerPage />;
    if (activeTab === 'proof-review' && user?.role === 'admin') return <AdminProofReview />;

    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'admin':
        return <AdminDashboard activeTab={activeTab} />;
      case 'student':
        return <StudentDashboard activeTab={activeTab} />;
      case 'landlord':
        return <LandlordDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      {/* AI NestChat — available to all logged-in users */}
      <AIChat />
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
