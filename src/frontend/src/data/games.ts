export interface PopularGame {
  id: string;
  title: string;
  genre: string;
  color: string;
  src: string;
  fallbackSrc?: string;
}

export const POPULAR_GAMES: PopularGame[] = [
  {
    id: "motox3m",
    title: "Moto X3M",
    genre: "Racing",
    color: "orange",
    src: "https://www.crazygames.com/embed/moto-x3m",
  },
  {
    id: "stickman-hook",
    title: "Stickman Hook",
    genre: "Action",
    color: "blue",
    src: "https://www.crazygames.com/embed/stickman-hook",
  },
  {
    id: "cut-the-rope",
    title: "Cut the Rope",
    genre: "Puzzle",
    color: "green",
    src: "https://www.crazygames.com/embed/cut-the-rope-remastered",
  },
  {
    id: "bullet-force",
    title: "Bullet Force",
    genre: "Shooter",
    color: "red",
    src: "https://www.crazygames.com/embed/bullet-force-multiplayer",
  },
  {
    id: "drift-boss",
    title: "Drift Boss",
    genre: "Racing",
    color: "yellow",
    src: "https://www.crazygames.com/embed/drift-boss",
  },
  {
    id: "soccer-random",
    title: "Soccer Random",
    genre: "Sports",
    color: "purple",
    src: "https://www.crazygames.com/embed/soccer-random",
  },
];
