import { useEffect, useMemo, useState } from "react";
import Popup from "../../../common/Popup";
import API from "../../../config/axios.config";
import { usePopup } from "../../../hooks/usePopup";

type UserRole = "admin" | "user" | "developer" | "tester" | "manager" | "guest";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole | string;
  image_url?: string;
}

interface UsersApiResponse {
  data: AdminUser[] | { users?: AdminUser[]; total?: number; pages?: number };
}

const roleOptions: UserRole[] = [
  "admin",
  "user",
  "developer",
  "tester",
  "manager",
  "guest",
];

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Something went wrong. Please try again.";
};

const getUsersFromResponse = (response: UsersApiResponse) => {
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.users)) {
    return response.data.users;
  }

  return [];
};

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { popupState, showSuccess, showError, showWarning, closePopup } =
    usePopup();

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await API.get<UsersApiResponse>("/user");
      setUsers(getUsersFromResponse(response.data));
    } catch (fetchError) {
      showError("Failed to Load Users", getErrorMessage(fetchError), "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email, user.role].some((field) =>
        field?.toLowerCase().includes(value),
      ),
    );
  }, [searchTerm, users]);

  const handleRoleChange = async (
    userId: string,
    newRole: string,
    userName: string,
  ) => {
    const previousUsers = users;

    setSavingId(userId);
    setUsers((current) =>
      current.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user,
      ),
    );

    try {
      await API.patch(`/user/${userId}`, { role: newRole });
      showSuccess(
        "Role Updated",
        `${userName}'s role has been changed to ${newRole}.`,
        "Updated",
      );
    } catch (roleError) {
      setUsers(previousUsers);
      showError("Failed to Update Role", getErrorMessage(roleError), "Error");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    showWarning(
      "Delete User Account",
      `Are you sure you want to permanently delete ${userName}'s account? This action cannot be undone.`,
      async () => {
        const previousUsers = users;

        setSavingId(userId);
        setUsers((current) => current.filter((user) => user._id !== userId));

        try {
          await API.delete(`/user/${userId}`);
          showSuccess(
            "User Deleted",
            `${userName}'s account has been permanently removed.`,
            "Deleted",
          );
        } catch (deleteError) {
          setUsers(previousUsers);
          showError(
            "Failed to Delete User",
            getErrorMessage(deleteError),
            "Error",
          );
        } finally {
          setSavingId(null);
        }
      },
      "Delete",
    );
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-8 text-left text-slate-900 sm:px-6 lg:px-8">
      <Popup config={popupState} onClose={closePopup} />
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              People
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              User management
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Search users, update roles, and remove inactive accounts.
            </p>
          </div>

          <label className="relative block w-full md:max-w-sm">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search users"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid-cols-[1.4fr_1.6fr_0.8fr_0.5fr]">
            <span>Name</span>
            <span className="hidden md:block">Email</span>
            <span>Role</span>
            <span className="text-right">Action</span>
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No users found.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-2 items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-[1.4fr_1.6fr_0.8fr_0.5fr]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {user.image_url ? (
                      <img
                        src={user.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name.slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 md:hidden">
                      {user.email}
                    </p>
                  </div>
                </div>

                <p className="hidden truncate text-sm text-slate-600 md:block">
                  {user.email}
                </p>

                <select
                  value={user.role}
                  disabled={savingId === user._id}
                  onChange={(event) =>
                    void handleRoleChange(
                      user._id,
                      event.target.value,
                      user.name,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <div className="text-right">
                  <button
                    type="button"
                    disabled={savingId === user._id}
                    onClick={() => void handleDelete(user._id, user.name)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    aria-label={`Delete ${user.name}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default UserManagement;
