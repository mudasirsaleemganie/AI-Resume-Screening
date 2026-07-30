import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("talentlens_user")); } catch { return null; }
  });

  useEffect(() => {
    const clear = () => setUser(null);
    window.addEventListener("auth-expired", clear);
    return () => window.removeEventListener("auth-expired", clear);
  }, []);

  const authenticate = async (mode, values) => {
    const { data } = await api.post(`/auth/${mode}`, values);
    localStorage.setItem("talentlens_token", data.token);
    localStorage.setItem("talentlens_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("talentlens_token");
    localStorage.removeItem("talentlens_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, authenticate, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

