import { ArrowRight, BrainCircuit, CheckCircle2, FileSearch, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "../router";

export default function Landing() {
  return <div className="landing">
    <nav className="topnav">
      <Link className="brand dark" to="/"><span className="brand-mark"><ScanSearch size={22} /></span><span>TalentLens<em>AI</em></span></Link>
      <div><Link className="text-link" to="/login">Sign in</Link><Link className="button small" to="/register">Get started</Link></div>
    </nav>
    <section className="hero">
      <div className="hero-copy">
        <span className="pill"><Sparkles size={15} /> Explainable resume intelligence</span>
        <h1>Hire for potential.<br /><span>Screen with evidence.</span></h1>
        <p>Turn every resume into a transparent job-match report with skill coverage, role prediction and practical recommendations.</p>
        <div className="hero-actions"><Link className="button" to="/register">Analyze your resume <ArrowRight size={18} /></Link><Link className="button secondary" to="/login">Recruiter sign in</Link></div>
        <div className="trust"><CheckCircle2 /> PDF & DOCX <CheckCircle2 /> Role-based access <CheckCircle2 /> Explainable scores</div>
      </div>
      <div className="hero-card">
        <div className="mock-head"><span>AI match report</span><span className="live-dot">Complete</span></div>
        <div className="mock-candidate"><span className="avatar large">MS</span><div><strong>Mudasir Saleem Ganie</strong><small>MERN Stack Developer</small></div><div className="mini-score">86<small>%</small></div></div>
        <div className="metric-row"><span>Skills match<strong>92%</strong></span><span>Semantic fit<strong>78%</strong></span><span>Experience<strong>83%</strong></span></div>
        <div className="skill-cloud"><span>React</span><span>Node.js</span><span>MongoDB</span><span>Express</span><span className="missing">Docker</span></div>
        <p className="ai-note"><BrainCircuit size={18} /><span><strong>Top prediction</strong>MERN Stack Developer · 91% confidence</span></p>
      </div>
    </section>
    <section className="feature-strip">
      <div><FileSearch /><strong>Smart parsing</strong><span>Extract structured skills and experience from resumes.</span></div>
      <div><BrainCircuit /><strong>Hybrid AI matching</strong><span>Combine skill coverage, semantic fit and experience.</span></div>
      <div><ShieldCheck /><strong>Responsible decisions</strong><span>Scores support human review; they never make final decisions.</span></div>
    </section>
  </div>;
}
