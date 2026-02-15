import React from "react";
import "./PlaceholderPanel.css";

interface PlaceholderPanelProps {
  title: string;
  description?: string;
}

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({ title, description }) => {
  return (
    <div className="placeholder-panel">
      <h2 className="placeholder-panel__title">{title}</h2>
      <p className="placeholder-panel__message">Coming soon</p>
      {description && <p className="placeholder-panel__description">{description}</p>}
    </div>
  );
};
