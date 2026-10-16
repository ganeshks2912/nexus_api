import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard(){
 const {user}=useAuth(); const [tenants,setTenants]=useState([]); const [apis,setApis]=useState([]); const [stats,setStats]=useState({}); const [error,setError]=useState("");
 useEffect(()=>{(async()=>{try{const t=await api.get("/tenants/my-tenants");setTenants(t.data.tenants||[]); if(t.data.tenants?.[0]){const list=await api.get(`/apis/${t.data.tenants[0].id}`);setApis(list.data.apis||[]);}}catch(e){setError(getErrorMessage(e));}})()},[]);
 useEffect(()=>{if(!apis.length)return; let cancelled=false;(async()=>{const all=await Promise.all(apis.map(a=>api.get(`/analytics/${a.id}`).then(r=>r.data.analytics).catch(()=>null)));if(cancelled)return;const valid=all.filter(Boolean);setStats({requests:valid.reduce((n,x)=>n+x.totalRequests,0),failed:valid.reduce((n,x)=>n+x.failedRequests,0),avg:valid.length?Math.round(valid.reduce((n,x)=>n+x.averageResponseTime,0)/valid.length):0});})();return()=>{cancelled=true}},[apis]);
 return <div><PageTitle title="Dashboard" subtitle={`Welcome back, ${user?.email || "user"}.`} />
 {error&&<div className="alert error">{error}</div>}
 <div className="stat-grid"><Stat label="Total APIs" value={apis.length}/><Stat label="Requests" value={stats.requests||0}/><Stat label="Failed Requests" value={stats.failed||0}/><Stat label="Avg. Response" value={`${stats.avg||0} ms`}/></div>
 <div className="content-grid"><section className="card"><div className="section-head"><div><h3>APIs</h3><p>Your current tenant APIs.</p></div><Link className="secondary" to="/apis">View all</Link></div>{apis.length?<div className="list">{apis.slice(0,5).map(a=><div className="list-row" key={a.id}><div><strong>{a.name}</strong><span>{a.base_url}</span></div><span className={`badge ${String(a.status).toLowerCase()}`}>{a.status}</span></div>)}</div>:<Empty text="No APIs found for your first tenant."/>}</section>
 <section className="card"><div className="section-head"><div><h3>Organizations</h3><p>Tenants you can access.</p></div><Link className="secondary" to="/organization">Manage</Link></div>{tenants.length?<div className="list">{tenants.map(t=><div className="list-row" key={t.id}><div><strong>{t.name}</strong><span>{t.slug}</span></div><span className="badge neutral">{t.role}</span></div>)}</div>:<Empty text="Create your first organization."/>}</section></div>
 </div>;
}
function Stat({label,value}){return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>}
export function PageTitle({title,subtitle,action}){return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>}
export function Empty({text}){return <div className="empty">{text}</div>}
