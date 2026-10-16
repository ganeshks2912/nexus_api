import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthPage } from "./Login";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form,setForm]=useState({name:"",email:"",password:""}); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const submit=async(e)=>{e.preventDefault();setError("");setBusy(true);try{await register(form.name,form.email,form.password);navigate("/dashboard",{replace:true});}catch(err){setError(getErrorMessage(err,"Registration failed"));}finally{setBusy(false);}};
  return <AuthPage title="Create your account" subtitle="Start managing APIs with Nexus APIs."><form onSubmit={submit} className="form-stack">
    <label className="field"><span>Name</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required /></label>
    <label className="field"><span>Email</span><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required /></label>
    <label className="field"><span>Password</span><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 8 characters" minLength={8} required /></label>
    {error&&<div className="alert error">{error}</div>}<button className="primary full" disabled={busy}>{busy?"Creating…":"Create account"}</button>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </form></AuthPage>;
}
