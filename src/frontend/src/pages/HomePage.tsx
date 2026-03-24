import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Anchor,
  Gamepad2,
  MapPin,
  Play,
  Star,
  Target,
  Trophy,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { POPULAR_GAMES, type PopularGame } from "../data/games";

interface HomePageProps {
  onPlayShips: () => void;
  onPlayMaplewood?: () => void;
  onPlayGame?: (game: PopularGame) => void;
}

const STATS = [
  { label: "Online Now", value: "8,241", icon: Users },
  { label: "Total Battles", value: "420K+", icon: Target },
  { label: "Rating", value: "4.8", icon: Star },
  { label: "Fleet Types", value: "12+", icon: Anchor },
];

const WAVE_LINES = [0, 1, 2, 3, 4, 5];

const FEATURES = [
  {
    icon: Anchor,
    title: "Fleet Command",
    desc: "Command destroyers, battleships, carriers and submarines across open ocean.",
  },
  {
    icon: Waves,
    title: "Dynamic Ocean",
    desc: "Realistic 3D water physics with weather effects, waves and storms.",
  },
  {
    icon: Target,
    title: "Naval Combat",
    desc: "Cannons, torpedoes, missiles and depth charges. Sink or be sunk.",
  },
  {
    icon: Trophy,
    title: "Multiplayer",
    desc: "Battle real players worldwide. Climb the global leaderboard.",
  },
];

const GENRE_COLORS: Record<string, string> = {
  orange:
    "from-orange-900/60 to-orange-950/40 border-orange-500/40 hover:border-orange-400/60",
  red: "from-red-900/60 to-red-950/40 border-red-500/40 hover:border-red-400/60",
  green:
    "from-green-900/60 to-green-950/40 border-green-500/40 hover:border-green-400/60",
  yellow:
    "from-yellow-900/60 to-yellow-950/40 border-yellow-500/40 hover:border-yellow-400/60",
  purple:
    "from-purple-900/60 to-purple-950/40 border-purple-500/40 hover:border-purple-400/60",
  blue: "from-blue-900/60 to-blue-950/40 border-blue-500/40 hover:border-blue-400/60",
  teal: "from-teal-900/60 to-teal-950/40 border-teal-500/40 hover:border-teal-400/60",
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
  const [previewActive, setPreviewActive] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative pt-14 overflow-hidden">
        <div className="relative h-[560px] md:h-[640px] bg-gradient-to-b from-slate-900 via-blue-950 to-background">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 60%, oklch(0.35 0.12 240) 0%, transparent 60%), radial-gradient(ellipse at 80% 40%, oklch(0.25 0.1 220) 0%, transparent 50%)",
              }}
            />
            {WAVE_LINES.map((i) => (
              <div
                key={`wave-${i}`}
                className="absolute left-0 right-0 h-px opacity-20"
                style={{
                  top: `${30 + i * 12}%`,
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.7 0.15 220), transparent)",
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-16 max-w-3xl">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 font-gaming text-xs mb-4 tracking-widest">
                FEATURED GAME
              </Badge>
              <h1 className="font-gaming text-5xl md:text-7xl font-black text-white mb-3 leading-tight">
                SHIPS
                <span className="block text-blue-400">3D</span>
              </h1>
              <p className="text-white/60 text-sm md:text-base mb-6 max-w-lg leading-relaxed">
                Command a naval fleet in full 3D multiplayer combat. Sink enemy
                warships, dodge torpedoes, and dominate the open ocean. No
                download required.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {STATS.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="panel-glass rounded-lg px-3 py-2 flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-gaming text-sm text-blue-400">
                        {value}
                      </div>
                      <div className="text-xs text-white/40">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={onPlayShips}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-gaming text-base tracking-widest px-8 h-12 shadow-lg shadow-blue-900/50"
                  data-ocid="home.primary_button"
                >
                  <Play className="w-5 h-5 mr-2 fill-white" />
                  PLAY NOW
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPreviewActive(!previewActive)}
                  className="border-white/20 text-white/70 font-gaming text-sm tracking-wider h-12 hover:border-blue-400/50 hover:text-white"
                  data-ocid="home.secondary_button"
                >
                  {previewActive ? "HIDE PREVIEW" : "QUICK PREVIEW"}
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 w-1/2 h-full hidden md:flex items-end justify-center opacity-60 pointer-events-none">
            <div
              className="w-96 h-48 mb-8 rounded-sm opacity-80"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.3 0.08 230) 0%, oklch(0.2 0.05 220) 100%)",
                clipPath:
                  "polygon(10% 100%, 8% 60%, 15% 55%, 20% 30%, 30% 25%, 40% 28%, 45% 20%, 55% 20%, 60% 28%, 70% 25%, 80% 30%, 85% 55%, 92% 60%, 90% 100%)",
                boxShadow: "0 0 60px oklch(0.5 0.15 220 / 0.4)",
              }}
            />
          </div>
        </div>
      </section>

      {previewActive && (
        <section className="bg-black border-y border-blue-900/40">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-gaming text-sm text-blue-400 tracking-widest">
                GAME PREVIEW
              </h2>
              <button
                type="button"
                onClick={() => setPreviewActive(false)}
                className="text-white/40 hover:text-white text-xs"
              >
                close
              </button>
            </div>
            <div
              className="rounded-xl overflow-hidden border border-blue-900/40"
              style={{ height: 500 }}
            >
              <iframe
                src="https://yp3d.com/ships3d/"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; keyboard"
                title="Ships 3D Preview"
                style={{ display: "block", border: "none" }}
              />
            </div>
            <p className="text-center text-xs text-white/30 mt-2">
              For the best experience,{" "}
              <button
                type="button"
                onClick={onPlayShips}
                className="text-blue-400 hover:underline"
              >
                Play Now
              </button>{" "}
              to go fullscreen
            </p>
          </div>
        </section>
      )}

      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        <section className="mb-14">
          <h2 className="font-gaming text-xl text-foreground tracking-wider mb-6">
            <span className="text-blue-400">▶</span> GAME FEATURES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="card-game rounded-xl p-5 border border-blue-900/30 hover:border-blue-500/40 transition-colors group"
              >
                <feature.icon className="w-7 h-7 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-gaming text-sm text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Maplewood Section */}
        <section className="mb-14" data-ocid="maplewood.section">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-teal-400" />
            <h2 className="font-gaming text-xl text-foreground tracking-wider">
              <span className="text-teal-400">▶</span> MAPLEWOOD
            </h2>
          </div>
          <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/40 via-green-950/30 to-background p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40 font-gaming text-xs tracking-widest mb-3">
                  OPEN WORLD
                </Badge>
                <h3 className="font-gaming text-2xl text-white mb-2">
                  Maplewood City
                </h3>
                <p className="text-white/50 text-sm max-w-lg leading-relaxed mb-4">
                  Explore a vast open-world city. Drive vehicles, interact with
                  NPCs, complete missions, and survive in this 3D browser-based
                  world. Full mobile touch controls included.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["Open World", "3D", "Mobile", "Missions", "Vehicles"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-xs text-teal-300/70 bg-teal-900/30 border border-teal-700/30 rounded px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
                <Button
                  onClick={onPlayMaplewood}
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-gaming tracking-widest px-8 h-12 shadow-lg shadow-teal-900/50"
                  data-ocid="maplewood.play_button"
                >
                  <Play className="w-5 h-5 mr-2 fill-white" />
                  PLAY MAPLEWOOD
                </Button>
              </div>
              <div className="hidden md:block w-48 h-32 rounded-xl bg-gradient-to-br from-teal-900/50 to-green-950/50 border border-teal-700/30 flex items-center justify-center shrink-0 overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 80%, oklch(0.3 0.1 160) 0%, oklch(0.15 0.05 160) 60%, transparent 100%)",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-teal-400/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Games Section */}
        <section className="mb-14" data-ocid="games.section">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <h2 className="font-gaming text-xl text-foreground tracking-wider">
              <span className="text-purple-400">▶</span> MORE GAMES
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
                  className={`bg-gradient-to-br ${cardColor} rounded-xl p-4 border transition-all group`}
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

        <section className="mb-12">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-background p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="font-gaming text-blue-400 text-sm tracking-widest">
                READY TO BATTLE?
              </span>
            </div>
            <h3 className="font-gaming text-3xl text-white mb-2">
              JOIN THE FLEET
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              Thousands of players are competing right now. Command your
              warships and dominate the ocean.
            </p>
            <Button
              onClick={onPlayShips}
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white font-gaming tracking-widest px-10 h-12 shadow-lg shadow-blue-900/50"
              data-ocid="home.submit_button"
            >
              <Anchor className="w-5 h-5 mr-2" />
              PLAY SHIPS 3D
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">
            Ships 3D by YP3D &nbsp;·&nbsp; Hosted on TRXGAMING
          </span>
          <p className="text-muted-foreground text-xs flex items-center gap-1">
            &copy; {new Date().getFullYear()} Built with{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "trxgaming")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
