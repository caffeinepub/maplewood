import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, MapPin, Play, Users, Zap } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { POPULAR_GAMES, type PopularGame } from "../data/games";

interface HomePageProps {
  onPlayShips: () => void;
  onPlayMaplewood?: () => void;
  onPlayGame?: (game: PopularGame) => void;
}

const GENRE_COLORS: Record<string, string> = {
  orange:
    "from-orange-900/50 to-orange-950/30 border-orange-500/30 hover:border-orange-400/60",
  red: "from-red-900/50 to-red-950/30 border-red-500/30 hover:border-red-400/60",
  green:
    "from-green-900/50 to-green-950/30 border-green-500/30 hover:border-green-400/60",
  yellow:
    "from-yellow-900/50 to-yellow-950/30 border-yellow-500/30 hover:border-yellow-400/60",
  purple:
    "from-purple-900/50 to-purple-950/30 border-purple-500/30 hover:border-purple-400/60",
  blue: "from-blue-900/50 to-blue-950/30 border-blue-500/30 hover:border-blue-400/60",
  teal: "from-teal-900/50 to-teal-950/30 border-teal-500/30 hover:border-teal-400/60",
};

const BADGE_COLORS: Record<string, string> = {
  orange: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  red: "bg-red-500/20 text-red-300 border-red-500/40",
  green: "bg-green-500/20 text-green-300 border-green-500/40",
  yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  teal: "bg-teal-500/20 text-teal-300 border-teal-500/40",
};

const BUTTON_COLORS: Record<string, string> = {
  orange: "bg-orange-600 hover:bg-orange-500",
  red: "bg-red-600 hover:bg-red-500",
  green: "bg-green-600 hover:bg-green-500",
  yellow: "bg-yellow-600 hover:bg-yellow-500",
  purple: "bg-purple-600 hover:bg-purple-500",
  blue: "bg-blue-600 hover:bg-blue-500",
  teal: "bg-teal-600 hover:bg-teal-500",
};

export default function HomePage({
  onPlayShips,
  onPlayMaplewood,
  onPlayGame,
}: HomePageProps) {
  const [shipsGlow, setShipsGlow] = useState(false);

  return (
    <div className="min-h-screen bg-[#080810] text-foreground">
      <Header />

      {/* Hero — Maplewood */}
      <section
        className="relative pt-14 overflow-hidden"
        data-ocid="hero.section"
      >
        <div className="relative">
          <div
            className="w-full h-[520px] md:h-[640px] bg-cover bg-center relative"
            style={{
              backgroundImage:
                "url('/assets/generated/maplewood-thumbnail.dim_800x450.png')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#080810]/95 via-[#080810]/70 to-[#080810]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="px-6 md:px-16 max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="text-[#00ff88] font-gaming text-xs tracking-[0.3em] uppercase">
                    Featured Game
                  </span>
                </div>

                <h1
                  className="font-gaming font-black text-white leading-none mb-2"
                  style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
                >
                  MAPLEWOOD
                </h1>
                <h2
                  className="font-gaming font-bold text-[#00ff88] tracking-widest text-lg md:text-2xl mb-6"
                  style={{ textShadow: "0 0 20px #00ff8880" }}
                >
                  CANADA
                </h2>

                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    "OPEN WORLD",
                    "MOBILE READY",
                    "MULTIPLAYER COMING SOON",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-gaming text-[#00b4ff]/80 border border-[#00b4ff]/30 bg-[#00b4ff]/10 rounded px-2 py-1 tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={onPlayMaplewood}
                  size="lg"
                  className="font-gaming text-base tracking-widest px-10 h-14 text-black font-bold shadow-2xl transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #00ff88, #00cc70)",
                    boxShadow: "0 0 30px #00ff8860, 0 4px 20px #00ff8840",
                  }}
                  data-ocid="hero.primary_button"
                >
                  <Play className="w-5 h-5 mr-2 fill-black" />
                  PLAY NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        {/* Ships 3D Featured */}
        <section className="mb-14" data-ocid="ships.section">
          <div className="flex items-center gap-3 mb-5">
            <Zap className="w-5 h-5 text-[#00b4ff]" />
            <h2 className="font-gaming text-base text-white tracking-[0.2em] uppercase">
              <span
                className="text-[#00b4ff]"
                style={{ textShadow: "0 0 10px #00b4ff" }}
              >
                ▶
              </span>{" "}
              Quick Play
            </h2>
          </div>

          <div
            className="rounded-2xl overflow-hidden border border-[#00b4ff]/20 bg-gradient-to-br from-blue-950/40 via-blue-900/10 to-[#080810] p-6 flex flex-col sm:flex-row items-center gap-6 group cursor-pointer hover:border-[#00b4ff]/50 transition-all duration-300"
            style={{ boxShadow: shipsGlow ? "0 0 30px #00b4ff20" : "none" }}
            onMouseEnter={() => setShipsGlow(true)}
            onMouseLeave={() => setShipsGlow(false)}
          >
            <div className="w-48 h-28 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center">
              <div
                className="w-full h-full"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 80%, #1e3a5f 0%, #0a1929 100%)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="font-gaming text-blue-400 text-2xl font-black tracking-wider"
                    style={{ textShadow: "0 0 20px #60a5fa" }}
                  >
                    SHIPS 3D
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 font-gaming text-xs tracking-widest mb-3">
                NAVAL COMBAT
              </Badge>
              <h3 className="font-gaming text-xl text-white mb-4">Ships 3D</h3>
              <Button
                onClick={onPlayShips}
                className="font-gaming text-sm tracking-widest px-8 h-10 text-white"
                style={{
                  background: "linear-gradient(135deg, #00b4ff, #0080cc)",
                  boxShadow: "0 0 20px #00b4ff50",
                }}
                data-ocid="ships.primary_button"
              >
                <Play className="w-4 h-4 mr-2 fill-white" />
                PLAY NOW
              </Button>
            </div>
          </div>
        </section>

        {/* More Games */}
        <section className="mb-14" data-ocid="games.section">
          <div className="flex items-center gap-3 mb-5">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <h2 className="font-gaming text-base text-white tracking-[0.2em] uppercase">
              <span
                className="text-purple-400"
                style={{ textShadow: "0 0 10px #c084fc" }}
              >
                ▶
              </span>{" "}
              More Games
            </h2>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            data-ocid="games.list"
          >
            {POPULAR_GAMES.map((game, idx) => {
              const cardColor = GENRE_COLORS[game.color] ?? GENRE_COLORS.blue;
              const badgeColor = BADGE_COLORS[game.color] ?? BADGE_COLORS.blue;
              const btnColor = BUTTON_COLORS[game.color] ?? BUTTON_COLORS.blue;
              return (
                <div
                  key={game.id}
                  className={`bg-gradient-to-br ${cardColor} rounded-xl p-4 border transition-all duration-300 group hover:-translate-y-1`}
                  style={{ backdropFilter: "blur(4px)" }}
                  data-ocid={`games.item.${idx + 1}`}
                >
                  <Badge
                    className={`${badgeColor} font-gaming text-xs tracking-widest mb-3`}
                  >
                    {game.genre.toUpperCase()}
                  </Badge>
                  <h3 className="font-gaming text-sm text-white mb-4 leading-tight">
                    {game.title}
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => onPlayGame?.(game)}
                    className={`${btnColor} text-white font-gaming text-xs tracking-widest w-full`}
                    data-ocid={`games.button.${idx + 1}`}
                  >
                    <Play className="w-3 h-3 mr-1 fill-white" />
                    PLAY
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div
            className="rounded-2xl border border-[#00ff88]/20 p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,0,0,0) 100%)",
              boxShadow: "inset 0 0 60px rgba(0,255,136,0.03)",
            }}
          >
            <Users
              className="w-8 h-8 text-[#00ff88] mx-auto mb-3"
              style={{ filter: "drop-shadow(0 0 8px #00ff88)" }}
            />
            <h3 className="font-gaming text-2xl text-white mb-2">
              JOIN THE WORLD
            </h3>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              Explore Maplewood Canada. An open-world city with crime, NPC
              interactions, vehicles, and total freedom.
            </p>
            <Button
              onClick={onPlayMaplewood}
              size="lg"
              className="font-gaming text-base tracking-widest px-10 h-12 text-black font-bold hover:scale-105 transition-transform"
              style={{
                background: "linear-gradient(135deg, #00ff88, #00cc70)",
                boxShadow: "0 0 25px #00ff8860",
              }}
              data-ocid="cta.primary_button"
            >
              <MapPin className="w-5 h-5 mr-2" />
              ENTER MAPLEWOOD
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-6 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-gaming text-white/20 text-xs tracking-widest">
            MAPLEWOOD GAMING PORTAL
          </span>
          <p className="text-white/20 text-xs flex items-center gap-1">
            &copy; {new Date().getFullYear()} Built with love using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "maplewood")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00b4ff]/60 hover:text-[#00b4ff] transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
