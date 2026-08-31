import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { TOKEN_KEY } from "../api/client";

interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      login: (newToken: string) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      },
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
