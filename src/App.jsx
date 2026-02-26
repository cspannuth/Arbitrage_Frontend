import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import Props from "./pages/Props.tsx";
import { supabase } from "./lib/supabase";

export default function App() {
  const [claims, setClaims] = useState(undefined);

  useEffect(() => {
    const refreshClaims = async () => {
      try {
        const response = await supabase.auth.getClaims();
        setClaims(response?.data?.claims ?? null);
      } catch {
        setClaims(null);
      }
    };

    refreshClaims();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshClaims();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setClaims(null);
  };

  const fallbackPath = claims ? "/" : "/auth";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage claims={claims} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute claims={claims}>
              <HomePage claims={claims} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/props"
          element={
            <ProtectedRoute claims={claims}>
              <Props claims={claims} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute claims={claims}>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={fallbackPath} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
