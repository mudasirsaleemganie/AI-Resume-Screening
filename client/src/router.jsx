import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);

export function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const navigate = useCallback((to, options = {}) => {
    window.history[options.replace ? "replaceState" : "pushState"]({}, "", to);
    setPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const value = useMemo(() => ({ path, navigate }), [navigate, path]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);
export const useNavigate = () => useRouter().navigate;

export function Link({ to, children, className = "", ...props }) {
  const { navigate } = useRouter();
  return <a href={to} className={className} {...props} onClick={(event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      navigate(to);
    }
  }}>{children}</a>;
}

export function NavLink({ to, children, className = "", ...props }) {
  const { path } = useRouter();
  const resolvedClass = typeof className === "function" ? className({ isActive: path === to }) : className;
  return <Link to={to} className={resolvedClass} {...props}>{children}</Link>;
}

export function Redirect({ to }) {
  const { navigate } = useRouter();
  useEffect(() => navigate(to, { replace: true }), [navigate, to]);
  return null;
}
