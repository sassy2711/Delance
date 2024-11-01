// ProjectCard.js
import React, { useState } from 'react';
import { addMilestone, getMilestones } from '../../../../services/web3';

function ProjectCard({ title, description, reward, status, employer, projectId }) {
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneDayCount, setMilestoneDayCount] = useState('');
  const [milestonePercentage, setMilestonePercentage] = useState('');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [showMilestones, setShowMilestones] = useState(false);

  const handleAddMilestone = async () => {
    if (!milestoneName || !milestoneDescription || !milestoneDayCount || !milestonePercentage) {
      alert("Please fill in all milestone details.");
      return;
    }
    try {
      await addMilestone(projectId, milestoneName, milestoneDescription, milestoneDayCount, milestonePercentage, employer);
      setStatusMessage("Milestone added successfully!");
      setMilestoneName('');
      setMilestoneDescription('');
      setMilestoneDayCount('');
      setMilestonePercentage('');
    } catch (error) {
      setStatusMessage("Failed to add milestone. Please try again.");
    }
  };

  const handleViewMilestones = async () => {
    try {
      if (!showMilestones) {
        const fetchedMilestones = await getMilestones(projectId);

        // Ensure fetched milestones are in an array format
        if (Array.isArray(fetchedMilestones)) {
          setMilestones(fetchedMilestones);
        } else {
          console.error("Fetched milestones data is not an array:", fetchedMilestones);
          setMilestones([]);
        }
      }
      setShowMilestones(!showMilestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>Description: {description}</p>
      <p>Reward: {reward} ETH</p>
      <p>Status: {status}</p>
      <p>Employer: {employer}</p>

      <button onClick={() => setShowMilestoneForm(!showMilestoneForm)}>
        {showMilestoneForm ? "Close Milestone Form" : "Add Milestone"}
      </button>

      {showMilestoneForm && (
        <div>
          <h4>Add Milestone</h4>
          <input
            type="text"
            placeholder="Milestone Name"
            value={milestoneName}
            onChange={(e) => setMilestoneName(e.target.value)}
          />
          <textarea
            placeholder="Milestone Description"
            value={milestoneDescription}
            onChange={(e) => setMilestoneDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Days to Complete"
            value={milestoneDayCount}
            onChange={(e) => setMilestoneDayCount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Percentage"
            value={milestonePercentage}
            onChange={(e) => setMilestonePercentage(e.target.value)}
          />
          <button onClick={handleAddMilestone}>Add Milestone</button>
        </div>
      )}

      <button onClick={handleViewMilestones}>
        {showMilestones ? "Hide Milestones" : "View Milestones"}
      </button>

      {showMilestones && (
        <div>
          <h4>Milestones</h4>
          {milestones.length > 0 ? (
            milestones.map((milestone) => (
              <div key={milestone.id}>
                <p>Milestone ID: {milestone.id}</p>
                <p>Name: {milestone.name}</p>
                <p>Description: {milestone.description}</p>
                <p>Days to Complete: {milestone.daycount}</p>
                <p>Percentage: {milestone.percentage}%</p>
                <p>Completed: {milestone.completed ? "Yes" : "No"}</p>
                <p>Proof File Hash: {milestone.proofFileHash}</p>
              </div>
            ))
          ) : (
            <p>No milestones available.</p>
          )}
        </div>
      )}

      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}

export default ProjectCard;
