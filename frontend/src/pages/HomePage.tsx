import { useState } from 'react';
import { Play, Users, Star, TrendingUp, Gamepad2, Globe, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import GameCard from '../components/GameCard';

interface HomePageProps {
  onPlay: () => void;
}

const STATS = [
  { label: 'Active Players', value: '24,891', icon: Users },
  { label: 'Total Plays', value: '1.2M+', icon: TrendingUp },
  { label: 'Rating', value: '4.9', icon: Star },
  { label: 'World Size', value: '500km²', icon: Globe },
];

const FEATURES = [
  { icon: '🏙️', title: 'Massive Open World', desc: 'Explore Maplewood city, Mapleville neighborhood, mountains, forests, rivers and lakes.' },
  { icon: '👮', title: 'Career System', desc: 'Become a police officer, SWAT member, first responder, or dealership worker.' },
  { icon: '🚗', title: 'Vehicles', desc: 'Drive cars, fly helicopters, pilot planes, and sail boats across the map.' },
  { icon: '🏠', title: 'Own a Home', desc: 'Purchase and customize your own home in Mapleville neighborhood.' },
  { icon: '⚔️', title: 'Weapons & Abilities', desc: 'Wield weapons from every era. Unlock superhuman flight and speed.' },
  { icon: '👥', title: 'Social Features', desc: 'Add friends, chat, and explore Maplewood together.' },
  { icon: '🐻', title: 'Wildlife', desc: 'Encounter deer, wolves, bears, and birds across the wilderness.' },
  { icon: '⛷️', title: 'Ski Resort', desc: 'Hit the slopes at the mountain ski resort in the Maplewood highlands.' },
];

export default function HomePage({ onPlay }: HomePageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-14 overflow-hidden">
        <div className="relative h-[520px] md:h-[600px]">
          <img
            src="/assets/generated/hero-banner.dim_1600x600.png"
            alt="Maplewood Canada"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-16 max-w-2xl">
              <Badge className="bg-neon-orange/20 text-neon-orange border-neon-orange/40 font-gaming text-xs mb-4 tracking-widest">
                FEATURED GAME
              </Badge>
              <h1 className="font-gaming text-4xl md:text-6xl font-black text-foreground mb-3 leading-tight">
                MAPLEWOOD
                <span className="block text-neon-orange">CANADA</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-lg leading-relaxed">
                The ultimate open-world life simulation. Explore a massive Canadian city, build a life, 
                cause chaos, or protect the peace — the choice is yours.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {STATS.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="panel-glass rounded-lg px-3 py-2 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-neon-orange" />
                    <div>
                      <div className="font-gaming text-sm text-neon-orange">{value}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onPlay}
                  size="lg"
                  className="btn-neon font-gaming text-base tracking-widest px-8 h-12 animate-glow-pulse"
                >
                  <Play className="w-5 h-5 mr-2 fill-white" />
                  PLAY NOW
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border font-gaming text-sm tracking-wider h-12 hover:border-neon-orange/50"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  HOW TO PLAY
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">

        {/* Featured Game Card */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-gaming text-xl text-foreground tracking-wider">
              <span className="text-neon-orange">▶</span> FEATURED GAME
            </h2>
            <Button variant="ghost" className="text-muted-foreground hover:text-neon-orange font-gaming text-xs">
              VIEW ALL <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <GameCard
                title="Maplewood Canada"
                thumbnail="/assets/generated/maplewood-thumbnail.dim_800x450.png"
                playCount="24,891 playing"
                rating={4.9}
                genre="Open World"
                description="The ultimate open-world life simulation set in Maplewood, Canada. Explore a massive city, mountains, forests, and lakes. Build a life, get a job, own a home, or go full criminal. Hundreds of NPCs, vehicles, weapons, and endless possibilities await."
                onPlay={onPlay}
                featured
              />
            </div>
            <div className="space-y-4">
              {/* Quick info panel */}
              <div className="card-game rounded-lg p-4">
                <h3 className="font-gaming text-neon-orange text-sm mb-3 tracking-wider">GAME INFO</h3>
                <div className="space-y-2 text-xs">
                  {[
                    ['Genre', 'Open World / Life Sim'],
                    ['Players', 'Single + Multiplayer'],
                    ['Map Size', '500km² Explorable'],
                    ['NPCs', '500+ Unique Characters'],
                    ['Vehicles', '50+ Land/Air/Sea'],
                    ['Creator', 'TRXGAMING'],
                    ['Updated', 'Feb 2026'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-foreground font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-game rounded-lg p-4">
                <h3 className="font-gaming text-neon-orange text-sm mb-3 tracking-wider">TAGS</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Open World', 'Life Sim', 'Action', 'Crime', 'Multiplayer', 'RPG', 'Sandbox', 'Canada'].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-border text-muted-foreground hover:border-neon-orange/40 cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <h2 className="font-gaming text-xl text-foreground tracking-wider mb-6">
            <span className="text-neon-orange">▶</span> GAME FEATURES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className={`card-game rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                  hoveredFeature === i ? 'border-neon-orange/50 bg-neon-orange/5' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-gaming text-xs text-foreground mb-1 leading-tight">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mb-12">
          <div className="relative rounded-xl overflow-hidden border border-neon-orange/30">
            <img
              src="/assets/generated/ski-resort.dim_800x450.png"
              alt="Ski Resort"
              className="w-full h-48 object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/60 flex items-center px-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-neon-orange" />
                  <span className="font-gaming text-neon-orange text-sm tracking-widest">NEW SEASON</span>
                </div>
                <h3 className="font-gaming text-2xl text-foreground mb-2">SKI RESORT NOW OPEN</h3>
                <p className="text-muted-foreground text-sm mb-4">Hit the slopes at Maplewood Mountain Resort. New ski runs, lodge events, and winter activities.</p>
                <Button onClick={onPlay} className="btn-neon font-gaming text-xs tracking-wider">
                  <Play className="w-3 h-3 mr-2 fill-white" /> PLAY NOW
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 mt-4">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/trxgaming-logo.dim_400x120.png" alt="TRXGAMING" className="h-8 object-contain" />
            <span className="text-muted-foreground text-xs">© {new Date().getFullYear()} TRXGAMING. All rights reserved.</span>
          </div>
          <p className="text-muted-foreground text-xs flex items-center gap-1">
            Built with <span className="text-neon-red">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'maplewood-game')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-orange hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
