export interface PopularGame {
  id: string;
  title: string;
  genre: string;
  color: string;
  src: string;
}

export const POPULAR_GAMES: PopularGame[] = [
  {
    id: "motox3m",
    title: "Moto X3M",
    genre: "Racing",
    color: "orange",
    src: "https://html5.gamedistribution.com/6e875a3882b24a6c857a599c65b3e5f6/",
  },
  {
    id: "bulletforce",
    title: "Bullet Force",
    genre: "Shooter",
    color: "red",
    src: "https://html5.gamedistribution.com/9b96df03af864c3781374d0a4efb7e85/",
  },
  {
    id: "cuttherope",
    title: "Cut the Rope",
    genre: "Puzzle",
    color: "green",
    src: "https://html5.gamedistribution.com/87ab34f3bd3447d8adbbc3d96b88c407/",
  },
  {
    id: "crossyroad",
    title: "Crossy Road",
    genre: "Casual",
    color: "yellow",
    src: "https://html5.gamedistribution.com/0d6d360538694b4a9e0f7e16cb74e7f3/",
  },
  {
    id: "subwaysurfers",
    title: "Subway Surfers",
    genre: "Runner",
    color: "purple",
    src: "https://html5.gamedistribution.com/SubwaySurfersWeb/",
  },
  {
    id: "stickmanhook",
    title: "Stickman Hook",
    genre: "Action",
    color: "blue",
    src: "https://html5.gamedistribution.com/2d2438c2cf3e48e7b7edde47f0b3d58a/",
  },
];
