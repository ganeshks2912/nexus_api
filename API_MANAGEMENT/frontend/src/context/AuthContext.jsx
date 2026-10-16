import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nexus_user")) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nexus_access_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("nexus_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("nexus_access_token");
        localStorage.removeItem("nexus_refresh_token");
        localStorage.removeItem("nexus_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("nexus_access_token", res.data.accessToken);
    localStorage.setItem("nexus_refresh_token", res.data.refreshToken);
    const me = await api.get("/auth/me");
    setUser(me.data.user);
    localStorage.setItem("nexus_user", JSON.stringify(me.data.user));
  };

  const register = async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
    await login(email, password);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("nexus_refresh_token");
    try { if (refreshToken) await api.post("/auth/logout", { refreshToken }); } catch {}
    localStorage.removeItem("nexus_access_token");
    localStorage.removeItem("nexus_refresh_token");
    localStorage.removeItem("nexus_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
