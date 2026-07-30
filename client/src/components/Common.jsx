import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";

export function PageTitle({ eyebrow, title, text, action }) {
  return <header className="page-title"><div><span>{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</div>{action}</header>;
}

export function Empty({ title, text }) {
  return <div className="empty"><AlertCircle size={28} /><h3>{title}</h3><p>{text}</p></div>;
}

export function Loading() {
  return <div className="loading"><LoaderCircle className="spin" /> Loading…</div>;
}

export function Notice({ type = "error", children }) {
  return <div className={`notice ${type}`}>{type === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}{children}</div>;
}

export function Score({ value, label = "Match score", size = "large" }) {
  const score = Number(value || 0);
  const color = score >= 75 ? "#19a974" : score >= 50 ? "#e7a52b" : "#ef6262";
  return <div className={`score ${size}`} style={{ "--score": score, "--score-color": color }}>
    <div><strong>{score.toFixed(0)}</strong><small>%</small></div><span>{label}</span>
  </div>;
}

export function Status({ value }) {
  return <span className={`status status-${value}`}>{value}</span>;
}

