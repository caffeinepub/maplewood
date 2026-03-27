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
    id: "stickman-hook",
    title: "Stickman Hook",
    genre: "Arcade",
    color: "orange",
    src: "https://html5.gamedistribution.com/86e418e05cf940f6b9f4dc5acab553de/",
  },
  {
    id: "knife-hit",
    title: "Knife Hit",
    genre: "Casual",
    color: "red",
    src: "https://html5.gamedistribution.com/36af50fc0f0442b8a3fec9c58d6ff5f4/",
  },
  {
    id: "bob-robber",
    title: "Bob The Robber",
    genre: "Puzzle",
    color: "blue",
    src: "https://html5.gamedistribution.com/afd5975baa094bfc8e8f5f7e28f72741/",
  },
  {
    id: "fireboy-watergirl",
    title: "Fireboy & Watergirl",
    genre: "Adventure",
    color: "purple",
    src: "https://html5.gamedistribution.com/3af8c0e7a67b44a78bdee5c73a26f1a3/",
  },
  {
    id: "stack",
    title: "Stack",
    genre: "Casual",
    color: "green",
    src: "https://html5.gamedistribution.com/3e2ca81a3a384929aee04e80f4ab3b04/",
  },
  {
    id: "subway-surfers",
    title: "Subway Surfers",
    genre: "Runner",
    color: "yellow",
    src: "https://html5.gamedistribution.com/5c764792be5b4b0c9edd29e2a4b45015/",
  },
];
