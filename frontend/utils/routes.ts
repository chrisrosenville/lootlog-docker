type TRoute = {
  name: string;
  path: string;
};

// Items to display in navigation
export const ROUTES: TRoute[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "News",
    path: "/news",
  },
  {
    name: "Reviews",
    path: "/reviews",
  },
  {
    name: "Tech",
    path: "/tech",
  },
];
