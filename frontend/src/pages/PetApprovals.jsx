import React, { useEffect, useState, useContext, useMemo } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "../styles/pet-approvals.css";

const roleAccent = {
  shelter: "#5c7cfa",
  admin: "#e86f37",
  superadmin: "#0f9f6e",
};

export default function PetApprovals() {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMap, setActionMap] = useState({});

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const loadPending = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/pets/pending");
      setPets(res.data || []);
    } catch (err) {
      setError("Could not load pending pets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (id) => {
    setActionMap((prev) => ({ ...prev, [id]: "approving" }));
    try {
      await api.put(`/pets/${id}/approve`);
      setPets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err?.response?.data || "Approval failed. Ensure you’re not approving your own listing.");
    } finally {
      setActionMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleReject = async (id) => {
    setActionMap((prev) => ({ ...prev, [id]: "rejecting" }));
    try {
      await api.put(`/pets/${id}/reject`);
      setPets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err?.response?.data || "Rejection failed.");
    } finally {
      setActionMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const summary = useMemo(() => {
    const counts = pets.reduce(
      (acc, pet) => {
        const role = (pet?.owner?.role || "").toLowerCase();
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      {}
    );
    return counts;
  }, [pets]);

  if (!isAdmin) {
    return (
      <div className="pet-approvals-shell">
        <div className="pet-approvals-empty">
          <h2>Access restricted</h2>
          <p>Only admins and superadmins can review listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-approvals-shell">
      <header className="pet-approvals-hero">
        <div>
          <p className="pill pill--muted">Review queue</p>
          <h1>Pet Approvals</h1>
          <p>Only shelter/admin listings are reviewable. You can’t approve your own listing.</p>
        </div>
        <div className="summary-box">
          <div>
            <small>Pending</small>
            <strong>{pets.length}</strong>
          </div>
          <div className="summary-grid">
            {Object.entries(summary).map(([role, count]) => (
              <div key={role} className="summary-chip" style={{ borderColor: roleAccent[role] || "#d0d7e2" }}>
                <span>{role || "unknown"}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </header>

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <div className="pet-approvals-empty">
          <div className="loader" aria-label="Loading approvals" />
          <p>Loading pending pets...</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="pet-approvals-empty">
          <h2>All clear</h2>
          <p>No listings waiting for review.</p>
        </div>
      ) : (
        <div className="bento-grid">
          {pets.map((pet) => {
            const ownerRole = (pet?.owner?.role || "").toLowerCase();
            const isSelf = pet?.owner?.id === user?.id;
            const isShelterListing = ownerRole === "shelter";
            const approveDisabled = isSelf || actionMap[pet.id] === "approving";
            return (
              <div key={pet.id} className="bento-card">
                <div className="bento-card__media">
                  {pet.imageUrl ? (
                    <img src={pet.imageUrl} alt={pet.name} loading="lazy" />
                  ) : (
                    <div className="bento-card__placeholder">No image</div>
                  )}
                </div>
                <div className="bento-card__body">
                  <div className="bento-card__header">
                    <div>
                      <p className="pill" style={{ background: "#eef2ff", color: "#4338ca" }}>
                        {pet.species}
                      </p>
                      <h3>{pet.name}</h3>
                      <p className="muted">{pet.breed || "Unknown breed"} · {pet.location || "Unknown location"}</p>
                    </div>
                    <div className="owner-chip" style={{ borderColor: roleAccent[ownerRole] || "#d0d7e2" }}>
                      <span className="owner-dot" style={{ background: roleAccent[ownerRole] || "#94a3b8" }} />
                      <div>
                        <small>{ownerRole || "owner"}</small>
                        <strong>{pet.owner?.name || "Unknown"}</strong>
                        <small>{pet.owner?.email || ""}</small>
                      </div>
                    </div>
                  </div>
                  <p className="bento-card__description">{pet.description || "No description provided."}</p>
                  <div className="bento-card__meta">
                    <span className="tag">Age: {pet.age || "N/A"}</span>
                    <span className="tag">Gender: {pet.gender || "N/A"}</span>
                    <span className="tag">Status: {pet.status || "Available"}</span>
                  </div>
                  <div className="bento-card__actions">
                    <button
                      className="btn btn--ghost"
                      onClick={() => handleReject(pet.id)}
                      disabled={actionMap[pet.id] === "rejecting"}
                    >
                      {actionMap[pet.id] === "rejecting" ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={() => handleApprove(pet.id)}
                      disabled={approveDisabled || !isShelterListing}
                      title={!isShelterListing ? "Only shelter/admin listings are approvable" : isSelf ? "You cannot approve your own listing" : ""}
                    >
                      {approveDisabled ? "Not allowed" : actionMap[pet.id] === "approving" ? "Approving..." : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
