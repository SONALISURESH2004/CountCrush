import React from 'react';
import './Abacus.css';

export default function Abacus() {
  // Simple static abacus UI — customize as needed
  return (
    <div className="abacus-container">
      <div className="rod">
        <div className="bead"></div>
        <div className="bead"></div>
        <div className="bead"></div>
        <div className="bead"></div>
        <div className="bead"></div>
      </div>
      <div className="rod">
        <div className="bead"></div>
        <div className="bead"></div>
        <div className="bead"></div>
        <div className="bead"></div>
        <div className="bead"></div>
      </div>
      {/* Add more rods/beads for full abacus */}
    </div>
  );
}
