import { BarChart3, BriefcaseBusiness, FileSearch, LogOut, ScanSearch, ShieldCheck, Users } from "lucide-react";
import { NavLink } from "../router";
import { useAuth } from "../state/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const candidate = user.role === "candidate";
  const admin = user.role === "admin";
  const links = candidate
    ? [["/jobs", BriefcaseBusiness, "Explore jobs"], ["/applications", FileSearch, "My applications"]]
    : [["/recruiter", BarChart3, "Recruiter overview"], ["/jobs", BriefcaseBusiness, "Manage jobs"]];
  if (admin) links.push(["/admin", ShieldCheck, "Administration"], ["/admin/users", Users, "Users"]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/">
          <span className="brand-mark"><ScanSearch size={22} /></span>
          <span>TalentLens<em>AI</em></span>
        </NavLink>
        <nav>
          <p className="nav-label">Workspace</p>
          {links.map(([to, Icon, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="profile">
          <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
          <div><strong>{user.name}</strong><small>{user.role}</small></div>
          <button className="icon-button" onClick={logout} title="Sign out"><LogOut size={17} /></button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
