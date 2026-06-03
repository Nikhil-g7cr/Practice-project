import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../../common/Popup";
import API from "../../../config/axios.config";
import { usePopup } from "../../../hooks/usePopup";
import { useAppSelector } from "../../../redux/hooks/reduxHooks";
import type { FormField } from "../../../common/DynamicForm";
import DynamicForm from "../../../common/DynamicForm";

type UserRole = "admin" | "user" | "developer" | "tester" | "manager" | "guest";

const roleOptions: UserRole[] = [
  "admin",
  "user",
  "developer",
  "tester",
  "manager",
  "guest",
];

const createUserFields: FormField[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter full name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "name@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    minLength: 8,
    placeholder: "Strong password",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: roleOptions.map((role) => ({
      label: role.charAt(0).toUpperCase() + role.slice(1),
      value: role,
    })),
  },
];

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole | string;
  image_url?: string;
}

interface UsersApiResponse {
  data: AdminUser[] | { users?: AdminUser[] };
}

interface CreateUserApiResponse {
  data: AdminUser;
}

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
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { popupState, showSuccess, showError, showWarning, closePopup } =
    usePopup();

  const isOwnAccount = (user: AdminUser) =>
    user._id === currentUser?.id || user.email === currentUser?.email;

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

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // --- REWRITTEN: Now accepts formData directly from DynamicForm ---
  const handleCreateUserSubmit = async (formData: Record<string, any>) => {
    setIsCreating(true);

    try {
      const response = await API.post<CreateUserApiResponse>("/user", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      const newUser = response.data.data;
      setUsers((current) => [newUser, ...current]);
      closeCreateModal();
      showSuccess(
        "User Created",
        `${newUser.name}'s account has been created successfully.`,
        "Created",
      );
    } catch (createError) {
      showError("Failed to Create User", getErrorMessage(createError), "Error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: string,
    userName: string,
  ) => {
    const targetUser = users.find((user) => user._id === userId);

    if (targetUser && isOwnAccount(targetUser)) {
      showWarning(
        "Role Locked",
        "You cannot change your own admin role from this page.",
        () => undefined,
        "Protected",
      );
      return;
    }

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

  const handleDelete = (userId: string, userName: string) => {
    const targetUser = users.find((user) => user._id === userId);

    if (targetUser && isOwnAccount(targetUser)) {
      showWarning(
        "Account Protected",
        "You cannot delete your own admin account from this page.",
        () => undefined,
        "Protected",
      );
      return;
    }

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
      true, 
      "delete", 
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-left text-slate-900 sm:px-6 lg:px-8">
      <Popup config={popupState} onClose={closePopup} />

      <section className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          Back
        </button>

        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
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

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[420px]">
            <label className="relative flex-1 min-w-0">
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

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add user
            </button>
          </div>
        </div>

        {/* User Table / List */}
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
            filteredUsers.map((user) => {
              const ownAccount = isOwnAccount(user);

              return (
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
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {user.name}
                        </p>
                        {ownAccount && (
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700 shrink-0">
                            You
                          </span>
                        )}
                      </div>
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
                    disabled={savingId === user._id || ownAccount}
                    title={
                      ownAccount ? "You cannot change your own role" : undefined
                    }
                    onChange={(event) =>
                      void handleRoleChange(
                        user._id,
                        event.target.value,
                        user.name,
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:opacity-80"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <div className="text-right">
                    {!ownAccount && (
                      <button
                        type="button"
                        disabled={savingId === user._id}
                        onClick={() => handleDelete(user._id, user.name)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        aria-label={`Delete ${user.name}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* FIXED CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm transition-opacity">
          <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-full">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Add new user
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create an account and assign the correct role.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={isCreating}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Modal Body with Dynamic Form */}
            <div className="overflow-y-auto px-6 py-6">
              <DynamicForm
                fields={createUserFields}
                onSubmit={handleCreateUserSubmit}
                submitButtonText={isCreating ? "Creating..." : "Create User"}
              />
            </div>

            {/* Modal Footer (Cleaned up, just Cancel button left) */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={isCreating}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>
              {/* DynamicForm handles the submit button inside its own block now! */}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserManagement;