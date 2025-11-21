import React, { useState, useEffect } from "react";
import axios from "axios";
import SectionHero from "../components/SectionHero";
import "../styles/detection-history.css";

const PetDetectionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/ai/history");
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <SectionHero title="Detection History" subtitle="Loading history..." />
      </div>
    );
  }

  return (
    <div className="page">
      <SectionHero
        badge={<span>AI powered</span>}
        title="Pet Detection History"
        subtitle="Review previous AI detections and insights."
      />
      <section className="page-section detection-history">
        {history.length === 0 ? (
          <div className="surface-card detection-history__empty">
            <p>No detection history yet.</p>
          </div>
        ) : (
          <div className="detection-history__list">
            {history.map((item) => {
              const isOpen = expandedId === item.id;
              const created = new Date(item.createdAt || Date.now());
              const summary = item.summary || item.analysis?.slice(0, 120) || "Detection results available.";
              return (
                <article
                  key={item.id}
                  className={`detection-card ${isOpen ? "is-open" : ""}`}
                  onClick={() => setExpandedId(isOpen ? null : item.id)}
                >
                  <div className="detection-card__header">
                    <div>
                      <p>Detection</p>
                      <strong>#{item.id}</strong>
                    </div>
                    <div>
                      <p>Captured</p>
                      <strong>{created.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</strong>
                    </div>
                    <div>
                      <p>Confidence</p>
                      <strong>{item.confidence ? `${Math.round(item.confidence * 100)}%` : "—"}</strong>
                    </div>
                    <button
                      type="button"
                      className="detection-card__toggle"
                      aria-expanded={isOpen}
                      onClick={(event) => {
                        event.stopPropagation();
                        setExpandedId(isOpen ? null : item.id);
                      }}
                    >
                      {isOpen ? "Hide details" : "View details"}
                    </button>
                  </div>
                  <div className="detection-card__summary">{summary}</div>
                  <div className="detection-card__body" aria-hidden={!isOpen}>
                    <dl>
                      <div>
                        <dt>Uploaded image</dt>
                        <dd>{item.imageName || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt>Breed insights</dt>
                        <dd>{item.analysis || "No analysis text returned by the service."}</dd>
                      </div>
                      {item.attributes && (
                        <div>
                          <dt>Attributes</dt>
                          <dd>{Array.isArray(item.attributes) ? item.attributes.join(", ") : item.attributes}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default PetDetectionHistory;
