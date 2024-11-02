// MilestoneCard.js
import React from 'react';

function MilestoneCard({ milestone }) {
  return (
    <div className="milestone-card">
      <p>Milestone ID: {milestone.id}</p>
      <p>Name: {milestone.name}</p>
      <p>Description: {milestone.description}</p>
      <p>Days to Complete: {milestone.daycount}</p>
      <p>Percentage: {milestone.percentage}%</p>
      <p>Completed: {milestone.completed ? "Yes" : "No"}</p>
      <p>Proof File Hash: {milestone.proofFileHash}</p>
    </div>
  );
}

export default MilestoneCard;
