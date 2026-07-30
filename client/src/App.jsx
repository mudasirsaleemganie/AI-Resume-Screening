import { useAuth } from "./state/AuthContext";
import { Redirect, useRouter } from "./router";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Recruiter from "./pages/Recruiter";
import Admin from "./pages/Admin";
import Users from "./pages/Users";

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  if (roles && !roles.includes(user.role)) return <Redirect to={user.role === "candidate" ? "/jobs" : "/recruiter"} />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  const { user } = useAuth();
  const { path } = useRouter();
  if (path === "/") return user ? <Redirect to={user.role === "candidate" ? "/jobs" : "/recruiter"} /> : <Landing />;
  if (path === "/login") return user ? <Redirect to="/" /> : <Auth mode="login" />;
  if (path === "/register") return user ? <Redirect to="/" /> : <Auth mode="register" />;
  if (path === "/jobs") return <Protected><Jobs /></Protected>;
  if (path === "/applications") return <Protected roles={["candidate"]}><Applications /></Protected>;
  if (path === "/recruiter") return <Protected roles={["recruiter", "admin"]}><Recruiter /></Protected>;
  if (path === "/admin") return <Protected roles={["admin"]}><Admin /></Protected>;
  if (path === "/admin/users") return <Protected roles={["admin"]}><Users /></Protected>;
  return <Redirect to="/" />;
}
