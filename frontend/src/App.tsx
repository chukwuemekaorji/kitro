import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { RequireAuth } from "./auth/RequireAuth";
import { OverviewPage } from "./pages/OverviewPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SignInPage } from "./pages/SignInPage";

export function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="products" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}
