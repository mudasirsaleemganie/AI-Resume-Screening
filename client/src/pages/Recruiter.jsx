import { BriefcaseBusiness, ChevronRight, FileCheck2, Trophy, UsersRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";
import { Empty, Loading, PageTitle, Score, Status } from "../components/Common";

export default function Recruiter() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/jobs").then((r) => setJobs(r.data.jobs)).finally(() => setLoading(false)); }, []);
  const open = async (job) => {
    setSelectedJob(job);
    const response = await api.get(`/applications/job/${job._id}`);
    setApplications(response.data.applications);
  };
  const update = async (item, status) => {
    await api.patch(`/applications/${item._id}/status`, { status });
    setApplications((all) => all.map((x) => x._id === item._id ? { ...x, status } : x));
  };
  const openJobs = jobs.filter((x) => x.status === "open").length;
  return <div>
    <PageTitle eyebrow="RECRUITER WORKSPACE" title="Hiring overview" text="Review ranked applicants and use AI insights as decision support." />
    <div className="stat-grid">
      <div className="stat"><BriefcaseBusiness /><span>Open jobs<strong>{openJobs}</strong></span></div>
      <div className="stat"><FileCheck2 /><span>Jobs created<strong>{jobs.length}</strong></span></div>
      <div className="stat"><UsersRound /><span>Selected applicants<strong>{selectedJob ? applications.length : "—"}</strong></span></div>
      <div className="stat"><Trophy /><span>Top match<strong>{applications[0]?.analysis?.overallScore ? `${applications[0].analysis.overallScore}%` : "—"}</strong></span></div>
    </div>
    <section className="panel"><div className="panel-head"><div><h2>Positions</h2><p>Select a job to review ranked candidates.</p></div></div>
      {loading ? <Loading /> : jobs.length === 0 ? <Empty title="No jobs created" text="Create your first position from the Jobs page." /> :
        <div className="table-wrap"><table><thead><tr><th>Position</th><th>Company</th><th>Location</th><th>Status</th><th /></tr></thead><tbody>
          {jobs.map((job) => <tr key={job._id}><td><strong>{job.title}</strong></td><td>{job.company}</td><td>{job.location}</td><td><Status value={job.status} /></td><td><button className="icon-button" onClick={() => open(job)}><ChevronRight /></button></td></tr>)}
        </tbody></table></div>}
    </section>
    {selectedJob && <div className="modal-backdrop"><section className="modal wide">
      <button className="modal-close" onClick={() => setSelectedJob(null)}><X /></button>
      <span className="eyebrow">RANKED APPLICANTS</span><h2>{selectedJob.title}</h2><p>{applications.length} application(s), ordered by overall match score.</p>
      {applications.length === 0 ? <Empty title="No applicants yet" text="Applications will appear here after screening." /> :
        <div className="candidate-list">{applications.map((item, index) => <article key={item._id} className="candidate-row">
          <span className="rank">#{index + 1}</span><div className="avatar">{item.candidate.name[0]}</div>
          <div className="candidate-name"><strong>{item.candidate.name}</strong><span>{item.candidate.email}</span><small>{item.analysis?.predictedRole || "Processing"}</small></div>
          <Status value={item.status} /><Score value={item.analysis?.overallScore} size="small" />
          <select value={item.status} onChange={(e) => update(item, e.target.value)}>
            <option value="screened">Screened</option><option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option><option value="hired">Hired</option>
          </select>
        </article>)}</div>}
    </section></div>}
  </div>;
}

