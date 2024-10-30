// src/components/ProjectCard/ProjectCard.js
import React from 'react';
import './ProjectCard.css'; // Import a CSS file for styling if needed

function ProjectCard({ title, description, reward, status, employer }) {
  return (
    <div className="project-card">
      <h3>{title || "No Title"}</h3>
      <p><strong>Description:</strong> {description || "No Description"}</p>
      <p><strong>Reward:</strong> {reward} ETH</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Employer:</strong> {employer}</p>
    </div>
  );
}

export default ProjectCard;
