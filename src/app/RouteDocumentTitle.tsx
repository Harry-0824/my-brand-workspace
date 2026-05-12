import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_ROUTES } from "./routes";

const TITLE_SUFFIX = "My Brand Workspace";

export function RouteDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const matchedRoute = APP_ROUTES.find((route) => route.path === location.pathname)
      ?? APP_ROUTES.find((route) => route.path === "*");

    if (!matchedRoute) {
      return;
    }

    document.title = `${matchedRoute.heading} | ${TITLE_SUFFIX}`;
  }, [location.pathname]);

  return null;
}
