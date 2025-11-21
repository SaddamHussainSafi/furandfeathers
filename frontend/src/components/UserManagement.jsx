import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Filter,
  RefreshCcw,
  Edit3,
  Shield,
  Loader2,
  X,
} from "lucide-react";
import API from "../services/api";
import "../styles/table.css";
import "../styles/admin-users.css";

const ROLE_FILTERS = [
  { label: "All roles", value: "ALL" },
  { label: "Adopters", value: "ADOPTER" },
  { label: "Shelters", value: "SHELTER" },
  { label: "Admins", value: "ADMIN" },
  { label: "Super Admins", value: "SUPERADMIN" },
];

const STATUS_FILTERS = [
  { label: "All status", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Rejected", value: "REJECTED" },
];

const STATUS_LABEL_CLASS = {
  active: "status-pill--active",
  pending: "status-pill--pending",
  suspended: "status-pill--suspended",
  rejected: "status-pill--rejected",
};

const ROLE_LABEL_CLASS = {
  adopter: "role-pill--adopter",
  shelter: "role-pill--shelter",
  admin: "role-pill--admin",
  superadmin: "role-pill--superadmin",
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getGeneratedAvatar = (user) =>
  `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
    user?.name || user?.email || "FF"
  )}&backgroundType=gradientLinear&fontWeight=700`;

const getAdminId = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    return stored?.id;
  } catch (error) {
    console.error("Unable to parse stored admin user:", error);
    return undefined;
  }
};

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <article className={clsx("admin-users__stat-card", `admin-users__stat-card--${tone}`)}>
    <div className="admin-users__stat-icon">
      <Icon size={18} />
    </div>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  </article>
);

const RolePill = ({ role }) => {
  const key = (role || "unknown").toLowerCase();
  return (
    <span className={clsx("role-pill", ROLE_LABEL_CLASS[key])}>
      {role || "UNKNOWN"}
    </span>
  );
};

const StatusPill = ({ status }) => {
  const key = (status || "unknown").toLowerCase();
  return (
    <span className={clsx("status-pill", STATUS_LABEL_CLASS[key])}>
      {status || "UNKNOWN"}
    </span>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editorUser, setEditorUser] = useState(null);
  const [editorRole, setEditorRole] = useState("ADOPTER");
  const [editorStatus, setEditorStatus] = useState("ACTIVE");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionTarget, setActionTarget] = useState(null);
  const [banner, setBanner] = useState(null);

  const adminId = useMemo(() => getAdminId(), []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => user.status === "ACTIVE").length;
    const suspended = users.filter((user) => user.status === "SUSPENDED").length;
    const shelters = users.filter((user) => user.role === "SHELTER").length;

    return { total, active, suspended, shelters };
  }, [users]);

  const filteredUsers = useMemo(() => {
    let dataset = [...users];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
      dataset = dataset.filter((user) => {
        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        return name.includes(normalizedSearch) || email.includes(normalizedSearch);
      });
    }

    if (roleFilter !== "ALL") {
      dataset = dataset.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "ALL") {
      dataset = dataset.filter((user) => user.status === statusFilter);
    }

    return dataset;
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async (showToast = false) => {
    setLoading(true);
    setBanner(null);
    try {
      const response = await API.get("/admin/users");
      const payload = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setUsers(payload);
      if (showToast) {
        setBanner({ type: "success", message: "User directory refreshed." });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setBanner({ type: "error", message: "Unable to load users. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const runUserAction = async (userId, actionFn, successMessage) => {
    if (!adminId) {
      setBanner({
        type: "error",
        message: "Missing admin session. Sign back in to manage users.",
      });
      return false;
    }

    setActionLoading(true);
    setActionTarget(userId);
    setBanner(null);

    try {
      await actionFn();
      if (successMessage) {
        setBanner({ type: "success", message: successMessage });
      }
      return true;
    } catch (error) {
      console.error("User management action error:", error);
      const message = error?.response?.data?.message || "Something went wrong while updating the user.";
      setBanner({ type: "error", message });
      return false;
    } finally {
      setActionLoading(false);
      setActionTarget(null);
    }
  };

  const handleSuspendUser = (user) =>
    runUserAction(
      user.id,
      async () => {
        await API.post(`/admin/users/${user.id}/suspend`, null, { params: { adminId } });
        setUsers((prev) =>
          prev.map((item) => (item.id === user.id ? { ...item, status: "SUSPENDED" } : item))
        );
      },
      `${user.name || "User"} suspended.`
    );

  const handleActivateUser = (user) =>
    runUserAction(
      user.id,
      async () => {
        await API.post(`/admin/users/${user.id}/activate`, null, { params: { adminId } });
        setUsers((prev) =>
          prev.map((item) => (item.id === user.id ? { ...item, status: "ACTIVE" } : item))
        );
      },
      `${user.name || "User"} reactivated.`
    );

  const handleSetSuperAdmin = (user) =>
    runUserAction(
      user.id,
      async () => {
        await API.post(`/admin/users/${user.id}/set-superadmin`, null, { params: { adminId } });
        setUsers((prev) =>
          prev.map((item) =>
            item.id === user.id ? { ...item, role: "SUPERADMIN", status: "ACTIVE" } : item
          )
        );
      },
      `${user.name || "User"} promoted to Super Admin.`
    );

  const handleOpenEditor = (user) => {
    setEditorUser(user);
    setEditorRole(user.role || "ADOPTER");
    setEditorStatus(user.status || "ACTIVE");
  };

  const handleCloseEditor = () => {
    setEditorUser(null);
  };

  const handleSubmitEditor = async () => {
    if (!editorUser) return;

    const success = await runUserAction(
      editorUser.id,
      async () => {
        await API.put(
          `/admin/users/${editorUser.id}/role`,
          { role: editorRole, status: editorStatus },
          { params: { adminId } }
        );
        setUsers((prev) =>
          prev.map((item) =>
            item.id === editorUser.id ? { ...item, role: editorRole, status: editorStatus } : item
          )
        );
      },
      `${editorUser.name || "User"} updated.`
    );

    if (success) {
      handleCloseEditor();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <div className="admin-users">
      <header className="admin-users__header">
        <div>
          <p className="admin-users__eyebrow">Access control</p>
          <h2>User Management</h2>
          <p>Search, filter, and edit roles without leaving the dashboard.</p>
        </div>
        <div className="admin-users__meta">
          <span>{filteredUsers.length} results</span>
          <button
            type="button"
            className="admin-users__refresh"
            onClick={() => fetchUsers(true)}
            disabled={loading}
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </header>

      <div className="admin-users__stats">
        <StatCard icon={Users} label="Total users" value={stats.total} tone="primary" />
        <StatCard icon={UserCheck} label="Active" value={stats.active} tone="success" />
        <StatCard icon={UserX} label="Suspended" value={stats.suspended} tone="warning" />
        <StatCard icon={ShieldCheck} label="Shelters" value={stats.shelters} tone="accent" />
      </div>

      {banner && (
        <div className={clsx("admin-users__banner", `admin-users__banner--${banner.type}`)}>
          <span>{banner.message}</span>
          <button type="button" onClick={() => setBanner(null)} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      {!adminId && (
        <div className="admin-users__banner admin-users__banner--warning">
          Actions are disabled until you sign in again. We couldn&apos;t confirm your admin session.
        </div>
      )}

      <div className="admin-users__filters">
        <label className="admin-users__field admin-users__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search name or email"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <label className="admin-users__field">
          <span>Role</span>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            {ROLE_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-users__field">
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="admin-users__reset" onClick={handleClearFilters}>
          <Filter size={16} />
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="admin-users__loading">
          <Loader2 size={24} className="spin" />
          <p>Loading directory...</p>
        </div>
      ) : (
        <div className="data-table-wrapper manage-table admin-users__table">
          <div className="admin-users__table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="admin-users__empty">
                        <p>No users match your filters.</p>
                        <button type="button" onClick={handleClearFilters}>
                          Reset filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredUsers.map((user) => {
                  const fallbackAvatar = getGeneratedAvatar(user);
                  const avatarSrc = user.picture || fallbackAvatar;
                  const isRowLoading = actionLoading && actionTarget === user.id;
                  const isSuspended = user.status === "SUSPENDED";
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-users__identity">
                          <img
                            src={avatarSrc}
                            alt={user.name || user.email || "User avatar"}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = fallbackAvatar;
                            }}
                          />
                          <div>
                            <strong>{user.name || "Unnamed user"}</strong>
                            <span>{user.email || "—"}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <RolePill role={user.role} />
                      </td>
                      <td>
                        <StatusPill status={user.status} />
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="admin-users__row-actions">
                          <button
                            type="button"
                            className="admin-users__action-btn"
                            onClick={() => handleOpenEditor(user)}
                            disabled={isRowLoading || !adminId}
                            title="Edit role"
                          >
                            {isRowLoading ? <Loader2 size={16} className="spin" /> : <Edit3 size={16} />}
                          </button>

                          <button
                            type="button"
                            className={clsx(
                              "admin-users__action-btn",
                              isSuspended ? "admin-users__action-btn--success" : "admin-users__action-btn--warn"
                            )}
                            onClick={() => (isSuspended ? handleActivateUser(user) : handleSuspendUser(user))}
                            disabled={isRowLoading || !adminId}
                            title={isSuspended ? "Activate user" : "Suspend user"}
                          >
                            {isRowLoading ? (
                              <Loader2 size={16} className="spin" />
                            ) : isSuspended ? (
                              <RefreshCcw size={16} />
                            ) : (
                              <UserX size={16} />
                            )}
                          </button>

                          {user.role !== "SUPERADMIN" && (
                            <button
                              type="button"
                              className="admin-users__action-btn admin-users__action-btn--accent"
                              onClick={() => handleSetSuperAdmin(user)}
                              disabled={isRowLoading || !adminId}
                              title="Promote to Super Admin"
                            >
                              {isRowLoading ? <Loader2 size={16} className="spin" /> : <Shield size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editorUser && (
        <div className="admin-users__modal-backdrop">
          <div className="admin-users__modal">
            <header>
              <h3>Update role &amp; status</h3>
              <p>{editorUser.email}</p>
            </header>

            <div className="admin-users__modal-body">
              <label>
                <span>Role</span>
                <select value={editorRole} onChange={(event) => setEditorRole(event.target.value)}>
                  {ROLE_FILTERS.filter((option) => option.value !== "ALL").map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Status</span>
                <select value={editorStatus} onChange={(event) => setEditorStatus(event.target.value)}>
                  {STATUS_FILTERS.filter((option) => option.value !== "ALL").map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="admin-users__modal-actions">
              <button type="button" className="ghost" onClick={handleCloseEditor}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmitEditor} disabled={actionLoading}>
                {actionLoading ? <Loader2 size={16} className="spin" /> : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
