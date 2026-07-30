import { BriefcaseBusiness, FileSearch, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";
import { Loading, PageTitle } from "../components/Common";

export default function Admin() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/admin/analytics").then((r) => setData(r.data)); }, []);
  if (!data) return <Loading />;
  const statuses = Object.fromEntries(data.statusBreakdown.map((x) => [x._id, x.count]));
  const maxRole = Math.max(...data.topRoles.map((x) => x.count), 1);
  return <div>
    <PageTitle eyebrow="SYSTEM CONTROL" title="Administration" text="Monitor platform adoption, screening activity and candidate outcomes." />
    <div className="stat-grid">
      <div className="stat purple"><UsersRound /><span>Total users<strong>{data.totals.users}</strong></span></div>
      <div className="stat blue"><BriefcaseBusiness /><span>Total jobs<strong>{data.totals.jobs}</strong></span></div>
      <div className="stat green"><FileSearch /><span>Applications<strong>{data.totals.applications}</strong></span></div>
      <div className="stat orange"><ShieldCheck /><span>Shortlisted<strong>{statuses.shortlisted || 0}</strong></span></div>
    </div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-head"><div><h2>Predicted roles</h2><p>Most common role classifications.</p></div></div>
        <div className="horizontal-chart">{data.topRoles.length ? data.topRoles.map((x) => <div key={x._id}><span>{x._id}</span><div><i style={{ width: `${x.count / maxRole * 100}%` }} /></div><strong>{x.count}</strong></div>) : <p>No analyzed resumes yet.</p>}</div>
      </section>
      <section className="panel"><div className="panel-head"><div><h2>Pipeline status</h2><p>Current applicant distribution.</p></div></div>
        <div className="pipeline">{["screened", "shortlisted", "rejected", "hired"].map((status) => <div key={status}><span className={`dot ${status}`} /><span>{status}</span><strong>{statuses[status] || 0}</strong></div>)}</div>
      </section>
      <section className="panel span-2"><div className="panel-head"><div><h2>Monthly activity</h2><p>Applications and average match score.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Month</th><th>Applications</th><th>Average score</th></tr></thead><tbody>
          {data.monthly.map((x) => <tr key={x._id}><td><strong>{x._id}</strong></td><td>{x.count}</td><td>{Number(x.avgScore || 0).toFixed(1)}%</td></tr>)}
        </tbody></table></div>
      </section>
    </div>
  </div>;
}

