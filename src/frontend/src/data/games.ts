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
    id: "krunker",
    title: "Krunker.io",
    genre: "Shooter",
    color: "red",
    src: "https://krunker.io/",
  },
  {
    id: "venge",
    title: "Venge.io",
    genre: "FPS",
    color: "orange",
    src: "https://venge.io/",
  },
  {
    id: "paper-io",
    title: "Paper.io 2",
    genre: "Strategy",
    color: "blue",
    src: "https://paper-io.com/",
  },
  {
    id: "wormate",
    title: "Wormate.io",
    genre: "Snake",
    color: "green",
    src: "https://wormate.io/",
  },
  {
    id: "shellshock",
    title: "Shell Shockers",
    genre: "Shooter",
    color: "yellow",
    src: "https://shellshock.io/",
  },
  {
    id: "littlebigsnake",
    title: "Little Big Snake",
    genre: "MMO",
    color: "purple",
    src: "https://littlebigsnake.com/",
  },
];
