import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setError(""); setBusy(true);
    try { await login(form.email, form.password); navigate(location.state?.from || "/dashboard", { replace: true }); }
    catch (err) { setError(getErrorMessage(err, "Invalid email or password")); }
    finally { setBusy(false); }
  };
  return <AuthPage title="Welcome back" subtitle="Sign in to manage your APIs and services.">
    <form onSubmit={submit} className="form-stack">
      <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({...form,email:v})} placeholder="you@example.com" />
      <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({...form,password:v})} placeholder="••••••••" />
      {error && <div className="alert error">{error}</div>}
      <button className="primary full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
    </form>
  </AuthPage>;
}

export function AuthPage({ title, subtitle, children }) {
  return <div className="auth-page"><div className="auth-card"><div className="auth-brand"><div className="brand-mark">N</div><strong>Nexus APIs</strong></div><h1>{title}</h1><p>{subtitle}</p>{children}</div></div>;
}
function Field({label,type="text",value,onChange,placeholder}) { return <label className="field"><span>{label}</span><input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} required /></label>; }
