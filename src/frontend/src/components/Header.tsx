import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  LogIn,
  LogOut,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import FriendsList from "./FriendsList";
import SettingsPanel from "./SettingsPanel";

interface HeaderProps {
  onProfileClick?: () => void;
}

export default function Header({ onProfileClick }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const [showSettings, setShowSettings] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const displayName = userProfile?.name || (isAuthenticated ? "Player" : null);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 panel-glass border-b border-neon-orange/20">
        <div className="flex items-center justify-between px-4 py-2 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/trxgaming-logo.dim_400x120.png"
              alt="TRXGAMING"
              className="h-10 object-contain"
            />
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {["HOME", "GAMES", "COMMUNITY", "STORE"].map((item) => (
              <button
                type="button"
                key={item}
                className="font-gaming text-xs tracking-widest text-muted-foreground hover:text-neon-orange transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, players..."
                className="pl-9 bg-muted/50 border-border text-sm h-8"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-neon-orange"
                  onClick={() => setShowFriends(true)}
                >
                  <Users className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-neon-orange"
                >
                  <Bell className="w-5 h-5" />
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-neon-orange"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-5 h-5" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                  >
                    <Avatar className="w-8 h-8 border border-neon-orange/40">
                      <AvatarFallback className="bg-muted text-neon-orange text-xs font-gaming">
                        {displayName
                          ? displayName.slice(0, 2).toUpperCase()
                          : "PL"}
                      </AvatarFallback>
                    </Avatar>
                    {displayName && (
                      <span className="hidden md:block text-sm font-medium text-foreground">
                        {displayName}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="panel-dark border-border w-48"
                >
                  <DropdownMenuItem
                    onClick={onProfileClick}
                    className="cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowSettings(true)}
                    className="cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleAuth}
                    className="cursor-pointer text-neon-red"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="btn-neon font-gaming text-xs tracking-wider px-4 h-8"
              >
                {isLoggingIn ? (
                  "LOGGING IN..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-1" /> LOGIN
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showFriends && <FriendsList onClose={() => setShowFriends(false)} />}
    </>
  );
}
