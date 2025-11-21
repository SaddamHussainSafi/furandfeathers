import React from "react";
import "../styles/cat-loader.css";

export default function CatLoader({ label = "Furly is thinking" }) {
  return (
    <div className="cat-loader" role="status" aria-live="polite">
      <div className="cat-loader__halo" />
      <svg className="cat-loader__svg" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id="catLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
        <path
          className="cat-loader__outline"
          d="M28 65 Q22 38 40 30 L50 18 Q58 10 60 22 Q62 10 70 18 L80 30 Q98 38 92 65 Q90 95 60 95 Q30 95 28 65 Z"
        />
        <path
          className="cat-loader__face"
          d="M32 66 Q30 90 60 90 Q90 90 88 66 Q90 44 74 38 L64 28 Q60 24 56 28 L46 38 Q30 44 32 66 Z"
        />
        <circle className="cat-loader__eye cat-loader__eye--left" cx="49" cy="62" r="4" />
        <circle className="cat-loader__eye cat-loader__eye--right" cx="71" cy="62" r="4" />
        <path className="cat-loader__nose" d="M60 70 L65 74 Q60 76 55 74 Z" />
        <path className="cat-loader__whisker cat-loader__whisker--left" d="M42 70 h-16" />
        <path className="cat-loader__whisker cat-loader__whisker--left" d="M44 75 h-16" />
        <path className="cat-loader__whisker cat-loader__whisker--right" d="M78 70 h16" />
        <path className="cat-loader__whisker cat-loader__whisker--right" d="M76 75 h16" />
      </svg>
      {label && <p className="cat-loader__label">{label}</p>}
    </div>
  );
}
