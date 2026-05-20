import { useEffect, useState } from "react";

import { AuthContext } from "./auth-context";
import { getProfile, login as loginRequest } from "../services/authService";
import type { User } from "../types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(() => !localStorage.getItem("academic-log-token"));

  useEffect(() => {
    const token = localStorage.getItem("academic-log-token");
    if (!token) return;

    getProfile()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("academic-log-token");
      })
      .finally(() => setIsReady(true));
  }, []);

  async function login(payload: { username: string; password: string }) {
    const response = await loginRequest(payload);
    localStorage.setItem("academic-log-token", response.token);
    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem("academic-log-token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
