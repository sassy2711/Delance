// delance/src/components/YourProjectCard.js
import React, { useEffect, useState } from 'react';
import { getFreelancerRating, getMilestones } from '../../../../services/web3'; // Adjust the path based on your project structure
import MilestoneCard from '../MilestoneCard/MilestoneCard';
import './ProjectCard.css'

const YourProjectCard = ({ project, selectedAccount }) => {
  const { id, title, description, reward, status, employer } = project;
  const [freelancerRating, setFreelancerRating] = useState(0);
  const [milestones, setMilestones] = useState([]);
  const [showMilestones, setShowMilestones] = useState(false);
  console.log(id);
  console.log(title);

  // Fetch the freelancer's rating when the component mounts
  useEffect(() => {
    const fetchFreelancerRating = async () => {
      if (selectedAccount) {
        try {
          const rating = await getFreelancerRating(selectedAccount);
          setFreelancerRating(rating.rating);
        } catch (error) {
          console.error('Error fetching freelancer rating:', error);
        }
      }
    };

    fetchFreelancerRating();
  }, [selectedAccount]);

  // Handle viewing milestones for the project
  const handleViewMilestones = async () => {
    try {
      if (!showMilestones) {
        const fetchedMilestones = await getMilestones(id);

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
    <div className="your-project-card">
      <h3>{title}</h3>
      <p>Description: {description}</p>
      <p>Reward: {reward} ETH</p>
      <p>Status: {status}</p>
      <p>Employer: {employer}</p>
      <p>Freelancer Rating: {freelancerRating.toString()} / 5</p>

      {/* Button to view milestones */}
      <button onClick={handleViewMilestones}>
        {showMilestones ? "Hide Milestones" : "View Milestones"}
      </button>

      {/* Display milestones if showMilestones is true */}
      {showMilestones && (
        <div>
          <h4>Milestones</h4>
          {milestones.length > 0 ? (
            milestones.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} selectedAccount={selectedAccount} />
            ))
          ) : (
            <p>No milestones available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default YourProjectCard;

