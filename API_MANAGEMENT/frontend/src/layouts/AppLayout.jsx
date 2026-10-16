import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  ["Dashboard", "/dashboard", "▦"],
  ["APIs", "/apis", "◈"],
  ["API Keys", "/api-keys", "⌁"],
  ["Analytics", "/analytics", "◒"],
  ["Organization", "/organization", "◎"],
  ["Gateway Tester", "/gateway", "▷"],
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div><strong>Nexus</strong><span>APIs</span></div>
        </div>
        <div className="nav-label">Workspace</div>
        <nav>
          {nav.map(([label, to, icon]) => (
            <NavLink key={to} to={to} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">{(user?.email?.[0] || "U").toUpperCase()}</div>
            <div className="user-mini-copy"><strong>{user?.email?.split("@")[0]}</strong><span>{user?.role}</span></div>
          </div>
          <button className="logout-button" onClick={async () => { await logout(); navigate("/login"); }}>Sign out</button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">API Management Platform</div>
          <div className="status-pill"><span className="dot"/> Backend connected</div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
