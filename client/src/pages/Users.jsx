import { useEffect, useState } from "react";
import api from "../api";
import { Loading, PageTitle } from "../components/Common";

export default function Users() {
  const [users, setUsers] = useState(null);
  useEffect(() => { api.get("/admin/users").then((r) => setUsers(r.data.users)); }, []);
  const update = async (user, changes) => {
    const response = await api.patch(`/admin/users/${user._id}`, changes);
    setUsers((all) => all.map((x) => x._id === user._id ? response.data.user : x));
  };
  return <div>
    <PageTitle eyebrow="ACCESS CONTROL" title="User management" text="Assign recruiter privileges and disable compromised or inactive accounts." />
    <section className="panel">{!users ? <Loading /> : <div className="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Account</th></tr></thead><tbody>
      {users.map((user) => <tr key={user._id}><td><strong>{user.name}</strong><small className="cell-sub">{user.email}</small></td>
        <td><select value={user.role} onChange={(e) => update(user, { role: e.target.value })}><option>candidate</option><option>recruiter</option><option>admin</option></select></td>
        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
        <td><button className={`toggle ${user.active ? "on" : ""}`} onClick={() => update(user, { active: !user.active })}><span />{user.active ? "Active" : "Disabled"}</button></td>
      </tr>)}
    </tbody></table></div>}</section>
  </div>;
}
