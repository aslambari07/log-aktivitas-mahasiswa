import { createContext } from "react";

import type { User } from "../types";

export const AuthContext = createContext<{
  user: User | null;
  isReady: boolean;
  login: (payload: { username: string; password: string }) => Promise<void>;
  logout: () => void;
} | null>(null);
