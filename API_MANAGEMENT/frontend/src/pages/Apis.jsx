import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api,{getErrorMessage} from "../services/api";
import Modal from "../components/Modal";
import { PageTitle, Empty } from "./Dashboard";

export default function Apis(){
 const [tenants,setTenants]=useState([]);const [tenantId,setTenantId]=useState("");const [apis,setApis]=useState([]);const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [show,setShow]=useState(false);const [form,setForm]=useState({name:"",description:"",baseUrl:""});
 const loadTenants=async()=>{const r=await api.get("/tenants/my-tenants");setTenants(r.data.tenants||[]);if(!tenantId&&r.data.tenants?.[0])setTenantId(r.data.tenants[0].id)};
 const loadApis=async(id=tenantId)=>{if(!id)return;const r=await api.get(`/apis/${id}`);setApis(r.data.apis||[])};
 useEffect(()=>{loadTenants().catch(e=>setError(getErrorMessage(e)))},[]);useEffect(()=>{loadApis().catch(e=>setError(getErrorMessage(e)))},[tenantId]);
 const create=async(e)=>{e.preventDefault();setBusy(true);setError("");try{await api.post("/apis",{tenantId,...form});setShow(false);setForm({name:"",description:"",baseUrl:""});await loadApis();}catch(e){setError(getErrorMessage(e))}finally{setBusy(false)}};
 const remove=async(id)=>{if(!confirm("Delete this API?"))return;try{await api.delete(`/apis/${id}`);await loadApis()}catch(e){setError(getErrorMessage(e))}};
 return <div><PageTitle title="APIs" subtitle="Create and manage APIs connected to your organizations." action={<button className="primary" onClick={()=>setShow(true)}>+ Create API</button>}/>
 {error&&<div className="alert error">{error}</div>}<div className="toolbar"><select value={tenantId} onChange={e=>setTenantId(e.target.value)}><option value="">Select organization</option>{tenants.map(t=><option key={t.id} value={t.id}>{t.name} · {t.role}</option>)}</select></div>
 <section className="card table-card">{apis.length?<table><thead><tr><th>API</th><th>Base URL</th><th>Rate Limit</th><th>Status</th><th></th></tr></thead><tbody>{apis.map(a=><tr key={a.id}><td><Link className="table-link" to={`/apis/${a.id}`}>{a.name}</Link><small>{a.description||"No description"}</small></td><td>{a.base_url}</td><td>{a.rate_limit||"—"}/{a.rate_limit_window?`${a.rate_limit_window}s`:"—"}</td><td><span className={`badge ${String(a.status).toLowerCase()}`}>{a.status}</span></td><td><button className="text-button danger-text" onClick={()=>remove(a.id)}>Delete</button></td></tr>)}</tbody></table>:<Empty text={tenantId?"No APIs in this organization yet.":"Select an organization."}/>}</section>
 {show&&<Modal title="Create API" onClose={()=>setShow(false)}><form className="form-stack" onSubmit={create}><Field label="Name" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Orders API"/><Field label="Description" value={form.description} onChange={v=>setForm({...form,description:v})} placeholder="Handles order requests"/><Field label="Base URL" value={form.baseUrl} onChange={v=>setForm({...form,baseUrl:v})} placeholder="http://localhost:6000"/><button className="primary full" disabled={busy}>{busy?"Creating…":"Create API"}</button></form></Modal>}
 </div>
}
function Field({label,value,onChange,placeholder}){return <label className="field"><span>{label}</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={label!=="Description"}/></label>}
