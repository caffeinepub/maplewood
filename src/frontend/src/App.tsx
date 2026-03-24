import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import ProfileSetupModal from "./components/ProfileSetupModal";
import type { PopularGame } from "./data/games";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import GamePlayerPage from "./pages/GamePlayerPage";
import GameView from "./pages/GameView";
import HomePage from "./pages/HomePage";
import ShipsGamePage from "./pages/ShipsGamePage";

type AppView = "home" | "ships" | "maplewood";

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [selectedGame, setSelectedGame] = useState<PopularGame | null>(null);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Secret Maplewood access via URL hash
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.hash === "#maplewood") {
        setCurrentView("maplewood");
      }
    };
    checkRoute();
    window.addEventListener("hashchange", checkRoute);
    return () => window.removeEventListener("hashchange", checkRoute);
  }, []);

  const handlePlayShips = () => setCurrentView("ships");
  const handlePlayMaplewood = () => {
    setCurrentView("maplewood");
    window.location.hash = "#maplewood";
  };
  const handleExitShips = () => {
    setCurrentView("home");
    window.history.pushState({}, "", window.location.pathname);
  };
  const handleExitMaplewood = () => {
    setCurrentView("home");
    window.location.hash = "";
  };

  // Selected popular game takes priority
  if (selectedGame) {
    return (
      <GamePlayerPage
        title={selectedGame.title}
        src={selectedGame.src}
        fallbackSrc={selectedGame.fallbackSrc}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  if (currentView === "ships") {
    return <ShipsGamePage onBack={handleExitShips} />;
  }

  if (currentView === "maplewood") {
    return (
      <>
        {showProfileSetup && <ProfileSetupModal />}
        <GameView onExit={handleExitMaplewood} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {showProfileSetup && <ProfileSetupModal />}
      <HomePage
        onPlayShips={handlePlayShips}
        onPlayMaplewood={handlePlayMaplewood}
        onPlayGame={(game) => setSelectedGame(game)}
      />
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
