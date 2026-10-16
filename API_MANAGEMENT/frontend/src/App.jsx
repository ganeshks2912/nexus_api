import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Apis from "./pages/Apis";
import ApiDetails from "./pages/ApiDetails";
import ApiKeys from "./pages/ApiKeys";
import Analytics from "./pages/Analytics";
import Organization from "./pages/Organization";
import GatewayTester from "./pages/GatewayTester";
import NotFound from "./pages/NotFound";

export default function App(){return <BrowserRouter><AuthProvider><Routes>
 <Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
 <Route element={<ProtectedRoute/>}><Route element={<AppLayout/>}>
  <Route index element={<Navigate to="/dashboard" replace/>}/><Route path="dashboard" element={<Dashboard/>}/><Route path="apis" element={<Apis/>}/><Route path="apis/:apiId" element={<ApiDetails/>}/><Route path="api-keys" element={<ApiKeys/>}/><Route path="analytics" element={<Analytics/>}/><Route path="analytics/:apiId" element={<Analytics/>}/><Route path="organization" element={<Organization/>}/><Route path="gateway" element={<GatewayTester/>}/>
 </Route></Route><Route path="*" element={<NotFound/>}/>
 </Routes></AuthProvider></BrowserRouter>}
