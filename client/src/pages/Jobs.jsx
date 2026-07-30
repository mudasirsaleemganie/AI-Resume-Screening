import { BriefcaseBusiness, MapPin, Plus, UploadCloud, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";
import { Empty, Loading, Notice, PageTitle } from "../components/Common";
import { useAuth } from "../state/AuthContext";

const blankJob = { title: "", company: "", location: "Remote", employmentType: "Full-time", description: "", requiredSkills: "", minimumExperience: 0, status: "open" };

export default function Jobs() {
  const { user } = useAuth();
  const candidate = user.role === "candidate";
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [jobForm, setJobForm] = useState(blankJob);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => api.get("/jobs").then((r) => setJobs(r.data.jobs)).finally(() => setLoading(false));
  useEffect(load, []);

  const apply = async (event) => {
    event.preventDefault(); setError(""); setMessage(""); setBusy(true);
    const data = new FormData(); data.append("resume", resume);
    try {
      const response = await api.post(`/applications/${selected._id}`, data);
      setMessage(`Screening complete: ${response.data.application.analysis.overallScore}% match`);
      setResume(null);
    } catch (err) { setError(err.response?.data?.message || "Application could not be processed"); }
    finally { setBusy(false); }
  };

  const createJob = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await api.post("/jobs", jobForm);
      setCreating(false); setJobForm(blankJob); await load();
    } catch (err) { setError(err.response?.data?.message || "Job could not be created"); }
    finally { setBusy(false); }
  };

  return <div>
    <PageTitle eyebrow={candidate ? "OPPORTUNITIES" : "RECRUITMENT"} title={candidate ? "Find your next role" : "Jobs"} text={candidate ? "Select a job and receive an explainable AI match report." : "Create and manage vacancies for your organisation."}
      action={!candidate && <button className="button" onClick={() => setCreating(true)}><Plus size={18} /> Create job</button>} />
    {message && <Notice type="success">{message}</Notice>}
    {error && <Notice>{error}</Notice>}
    {loading ? <Loading /> : jobs.length === 0 ? <Empty title="No jobs available" text="Open positions will appear here." /> :
      <div className="job-grid">{jobs.map((job) => <article className="job-card" key={job._id}>
        <div className="company-icon"><BriefcaseBusiness /></div>
        <span className={`status status-${job.status}`}>{job.status}</span>
        <h3>{job.title}</h3><strong>{job.company}</strong>
        <p><MapPin size={15} /> {job.location} · {job.employmentType}</p>
        <div className="skill-cloud">{job.requiredSkills.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}</div>
        <button className="button secondary full" onClick={() => setSelected(job)}>{candidate ? "View and apply" : "View details"}</button>
      </article>)}</div>}

    {selected && <div className="modal-backdrop"><section className="modal">
      <button className="modal-close" onClick={() => { setSelected(null); setError(""); setMessage(""); }}><X /></button>
      <span className="eyebrow">{selected.company}</span><h2>{selected.title}</h2>
      <p className="muted"><MapPin size={15} /> {selected.location} · {selected.employmentType} · {selected.minimumExperience}+ years</p>
      <h4>About the role</h4><p className="description">{selected.description}</p>
      <h4>Required skills</h4><div className="skill-cloud">{selected.requiredSkills.map((s) => <span key={s}>{s}</span>)}</div>
      {candidate && <form className="upload-form" onSubmit={apply}>
        <label className="dropzone"><UploadCloud /><strong>{resume ? resume.name : "Choose your resume"}</strong><span>PDF or DOCX · maximum 5 MB</span><input required type="file" accept=".pdf,.docx" onChange={(e) => setResume(e.target.files[0])} /></label>
        <button disabled={!resume || busy} className="button full">{busy ? "Analyzing resume…" : "Apply and analyze"}</button>
      </form>}
    </section></div>}

    {creating && <div className="modal-backdrop"><form className="modal form-grid" onSubmit={createJob}>
      <button type="button" className="modal-close" onClick={() => setCreating(false)}><X /></button><h2>Create a job</h2>
      <label>Job title<input required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} /></label>
      <label>Company<input required value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} /></label>
      <label>Location<input value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} /></label>
      <label>Minimum experience<input type="number" min="0" max="50" value={jobForm.minimumExperience} onChange={(e) => setJobForm({ ...jobForm, minimumExperience: Number(e.target.value) })} /></label>
      <label className="span-2">Required skills (comma-separated)<input required value={jobForm.requiredSkills} onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })} /></label>
      <label className="span-2">Description<textarea required minLength="20" rows="6" value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} /></label>
      <button disabled={busy} className="button span-2">{busy ? "Creating…" : "Create job"}</button>
    </form></div>}
  </div>;
}

