import { supabaseAdmin } from "@/lib/supabase";

export default async function UsersPage() {
  const { data: users } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-dark">Users</h1>
        <p className="text-muted text-sm mt-1">Registered customer profiles.</p>
      </div>

      <div className="card overflow-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {users && users.length > 0 ? (
              users.map((user: any) => (
                <tr key={user.id} className="border-b hover:bg-zinc-50">
                  <td className="p-4 font-bold">{user.name || "No name"}</td>
                  <td className="p-4">{user.email || "No email"}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold">
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-8 text-center text-muted" colSpan={5}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}