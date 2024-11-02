// src/components/Client/ProjectCard.js
import React, { useState } from 'react';
import { addMilestone, getMilestones, fetchRequestsByProjectId } from '../../../../services/web3';
import MilestoneCard from '../MilestoneCard/MilestoneCard';
import RequestCard from '../RequestCard/RequestCard';
import './ProjectCard.css';

function ProjectCard({ title, description, reward, status, employer, projectId }) {
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneDayCount, setMilestoneDayCount] = useState('');
  const [milestonePercentage, setMilestonePercentage] = useState('');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [showMilestones, setShowMilestones] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

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
      setShowMilestoneModal(false); // Close modal after successful addition
    } catch (error) {
      setStatusMessage("Failed to add milestone. Please try again.");
    }
  };

  const handleViewMilestones = async () => {
    try {
      if (!showMilestones) {
        const fetchedMilestones = await getMilestones(projectId);
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

  const handleViewRequests = async () => {
    try {
      if (!showRequests) {
        const fetchedRequests = await fetchRequestsByProjectId(projectId);
        setRequests(fetchedRequests);
      }
      setShowRequests(!showRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>Description: {description}</p>
      <p>Reward: {reward} ETH</p>
      <p>Status: {status}</p>
      <p>Employer: {employer}</p>

      <button onClick={() => setShowMilestoneModal(true)}>Add Milestone</button>

      {showMilestoneModal && (
        <div className="modal-overlay">
          <div className="modal">
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
            <div className="modal-buttons">
              <button onClick={handleAddMilestone}>Done</button>
              <button onClick={() => setShowMilestoneModal(false)}>Close</button>
            </div>
          </div>
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
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                selectedAddress={employer} // Pass employer as selectedAddress
                projectId={projectId} // Pass projectId
              />
            ))
          ) : (
            <p>No milestones available.</p>
          )}
        </div>
      )}

      <button onClick={handleViewRequests}>
        {showRequests ? "Hide Requests" : "View Requests"}
      </button>

      {showRequests && (
        <div>
          <h4>Requests</h4>
          {requests.length > 0 ? (
            requests.map((request) => (
              <RequestCard
                key={request.requestId}
                request={request}
                employer={employer}
                projectReward={reward}
              />
            ))
          ) : (
            <p>No requests available for this project.</p>
          )}
        </div>
      )}

      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}

export default ProjectCard;
