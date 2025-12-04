import React from "react";
import "../styles/loader.css";

const LOADER_TEXT = "Loading";

export default function CatLoader({ label = "Preparing your experience..." }) {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <div className="loader-core">
        <div className="loader-text" aria-hidden="true">
          {LOADER_TEXT.split("").map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="loader-letter"
              style={{ "--delay": `${index * 0.08}s` }}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="loader" aria-hidden="true" />
      </div>
      {label && <p className="loader-label">{label}</p>}
    </div>
  );
}
