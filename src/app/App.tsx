import { Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./routes";
import { AppLayout } from "../layouts/AppLayout";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {APP_ROUTES.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
    </Routes>
  );
}
