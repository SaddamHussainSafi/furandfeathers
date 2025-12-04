import React from "react";
import "../styles/typing-indicator.css";

export default function TypingIndicator({ label = "Furly is typing" }) {
  return (
    <div className="typing-indicator" role="status" aria-live="polite">
      <div className="typing-indicator__dots" aria-hidden="true">
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
      </div>
      {label && <span className="typing-indicator__label">{label}</span>}
    </div>
  );
}
