import { ArrowUpRight, BrainCircuit, CheckCircle2, Lightbulb, Target } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";
import { Empty, Loading, PageTitle, Score, Status } from "../components/Common";

export default function Applications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/applications/mine").then((r) => setItems(r.data.applications)).finally(() => setLoading(false)); }, []);
  return <div>
    <PageTitle eyebrow="CANDIDATE WORKSPACE" title="My applications" text="Your screening results are advisory and remain subject to human review." />
    {loading ? <Loading /> : items.length === 0 ? <Empty title="No applications yet" text="Explore jobs and upload your first resume." /> :
      <div className="application-list">{items.map((item) => <article className="application-card" key={item._id}>
        <div className="application-head">
          <div><Status value={item.status} /><h2>{item.job.title}</h2><p>{item.job.company} · {item.job.location}</p></div>
          {item.analysis?.overallScore !== undefined && <Score value={item.analysis.overallScore} />}
        </div>
        {item.analysis && <div className="analysis-grid">
          <section><h4><BrainCircuit /> Role prediction</h4><strong className="prediction">{item.analysis.predictedRole}</strong><p>{item.analysis.roleConfidence}% confidence</p></section>
          <section><h4><Target /> Score breakdown</h4>
            {[["Skills", item.analysis.skillScore], ["Semantic fit", item.analysis.semanticScore], ["Experience", item.analysis.experienceScore]].map(([label, value]) =>
              <div className="bar-row" key={label}><span>{label}</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>)}
          </section>
          <section><h4><CheckCircle2 /> Matched skills</h4><div className="skill-cloud">{item.analysis.matchedSkills.map((s) => <span key={s}>{s}</span>)}</div>
            {item.analysis.missingSkills.length > 0 && <><h4 className="spaced">Skills to develop</h4><div className="skill-cloud">{item.analysis.missingSkills.map((s) => <span className="missing" key={s}>{s}</span>)}</div></>}
          </section>
          <section><h4><Lightbulb /> Recommendations</h4><ul className="recommendations">{item.analysis.recommendations.map((r) => <li key={r}><ArrowUpRight />{r}</li>)}</ul></section>
        </div>}
      </article>)}</div>}
  </div>;
}

