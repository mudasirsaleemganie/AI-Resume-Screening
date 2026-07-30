import { ScanSearch } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "../router";
import { Notice } from "../components/Common";
import { useAuth } from "../state/AuthContext";

export default function Auth({ mode }) {
  const register = mode === "register";
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(""); setBusy(true);
    try { await authenticate(mode, values); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Could not complete sign in"); }
    finally { setBusy(false); }
  };
  return <div className="auth-page">
    <div className="auth-panel">
      <Link className="brand dark" to="/"><span className="brand-mark"><ScanSearch size={22} /></span><span>TalentLens<em>AI</em></span></Link>
      <div className="auth-copy"><span>RESUME INTELLIGENCE</span><h1>Every application deserves a fair, explainable review.</h1><p>Match capabilities to opportunities using transparent scoring and human oversight.</p></div>
    </div>
    <main className="auth-form-wrap">
      <form className="auth-form" onSubmit={submit}>
        <span className="eyebrow">{register ? "CREATE ACCOUNT" : "WELCOME BACK"}</span>
        <h2>{register ? "Start your job search" : "Sign in to your workspace"}</h2>
        <p>{register ? "Upload resumes and discover your strongest job-role match." : "Access your candidate, recruiter or admin dashboard."}</p>
        {error && <Notice>{error}</Notice>}
        {register && <label>Full name<input required maxLength="80" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder="Mudasir Saleem Ganie" /></label>}
        <label>Email address<input required type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} placeholder="you@example.com" /></label>
        <label>Password<input required minLength="8" type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} placeholder="Minimum 8 characters" /></label>
        <button className="button full" disabled={busy}>{busy ? "Please wait…" : register ? "Create account" : "Sign in"}</button>
        <p className="switch">{register ? "Already registered?" : "New to TalentLens?"} <Link to={register ? "/login" : "/register"}>{register ? "Sign in" : "Create account"}</Link></p>
      </form>
    </main>
  </div>;
}
