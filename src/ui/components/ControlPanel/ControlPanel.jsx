import React from 'react';
import './ControlPanel.css';

export default function ControlPanel({ logoSrc, title }) {
  return (
    <div className="control-panel">
      <div className="control-panel-logo">
        <img src={logoSrc} alt="Logo" />
      </div>
      <h1 className="control-panel-title">{title}</h1>
    </div>
  );
}