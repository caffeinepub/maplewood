import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import GameView from './pages/GameView';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

type AppView = 'home' | 'play';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handlePlay = () => setCurrentView('play');
  const handleExitGame = () => setCurrentView('home');

  return (
    <>
      {showProfileSetup && <ProfileSetupModal />}
      {currentView === 'home' ? (
        <HomePage onPlay={handlePlay} />
      ) : (
        <GameView onExit={handleExitGame} />
      )}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppContent />
    </ThemeProvider>
  );
}
