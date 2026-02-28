import { Play, Users, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  title: string;
  thumbnail: string;
  playCount: string;
  rating: number;
  genre: string;
  description: string;
  onPlay: () => void;
  featured?: boolean;
}

export default function GameCard({
  title,
  thumbnail,
  playCount,
  rating,
  genre,
  description,
  onPlay,
  featured = false,
}: GameCardProps) {
  return (
    <div className={`card-game rounded-lg overflow-hidden group ${featured ? 'col-span-full' : ''}`}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            featured ? 'h-64 md:h-80' : 'h-44'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onPlay}
            className="w-16 h-16 rounded-full btn-neon flex items-center justify-center"
          >
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-neon-orange/90 text-white border-0 font-gaming text-xs">
            {genre}
          </Badge>
          {featured && (
            <Badge className="bg-neon-red/90 text-white border-0 font-gaming text-xs">
              FEATURED
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 rounded px-2 py-1">
          <Star className="w-3 h-3 text-neon-yellow fill-neon-yellow" />
          <span className="text-xs font-gaming text-neon-yellow">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-gaming text-foreground text-sm font-bold mb-1 group-hover:text-neon-orange transition-colors">
          {title}
        </h3>
        {featured && (
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {playCount}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Open World
            </span>
          </div>
          <Button
            onClick={onPlay}
            size="sm"
            className="btn-neon font-gaming text-xs tracking-wider h-7 px-3"
          >
            <Play className="w-3 h-3 mr-1 fill-white" /> PLAY
          </Button>
        </div>
      </div>
    </div>
  );
}
