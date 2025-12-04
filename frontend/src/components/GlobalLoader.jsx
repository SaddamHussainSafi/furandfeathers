import React from "react";
import CatLoader from "./CatLoader";
import "../styles/global-loader.css";

const WIPES = Array.from({ length: 6 });

export default function GlobalLoader({ visible, exiting, label = "Loading the next view..." }) {
  if (!visible) return null;

  return (
    <div className={`global-loader ${exiting ? "is-exiting" : "is-entering"}`} aria-busy="true">
      <div className="global-loader__wipes" aria-hidden="true">
        {WIPES.map((_, index) => (
          <span
            key={index}
            className="global-loader__wipe"
            style={{ "--i": index }}
          />
        ))}
      </div>
      <div className="global-loader__content">
        <CatLoader label={label} />
      </div>
    </div>
  );
}
