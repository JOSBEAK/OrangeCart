export const routes = [
  { path: "/checkout", searchParam: "current=bag" },
  { path: "/checkout", searchParam: "current=delivery" },
  { path: "/checkout", searchParam: "current=payment" },
  { path: "/checkout", searchParam: "current=confirmation" },
];

export const getRouteIndex = (path, searchParams) => {
  const current = searchParams.get("current");
  return routes.findIndex(
    (route) => route.searchParam === `current=${current}`
  );
};

export const isRouteAllowed = (path, searchParams, highestAllowedIndex) => {
  const routeIndex = getRouteIndex(path, searchParams);
  return routeIndex <= highestAllowedIndex;
};

export const getNextRoute = (currentIndex) => {
  if (currentIndex < routes.length - 1) {
    const nextRoute = routes[currentIndex + 1];
    return `${nextRoute.path}?${nextRoute.searchParam}`;
  }
  return null;
};
