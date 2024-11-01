// FreelancerProjectCard.js
import React, { useEffect, useState } from 'react';
import { getFreelancerRating, sendRequest } from '../../../../services/web3'; // Adjust the path based on your project structure

const FreelancerProjectCard = ({ project, selectedAccount }) => { // Accept selectedAccount as a prop
  const { id, title, description, reward, status, employer } = project;
  const [freelancerRating, setFreelancerRating] = useState(0);
  const [loading, setLoading] = useState(false);
  console.log(selectedAccount);
  // Fetch the freelancer's rating when the component mounts
  useEffect(() => {
    const fetchFreelancerRating = async () => {
      if (selectedAccount) { // Use selectedAccount to fetch rating
        try {
          const rating = await getFreelancerRating(selectedAccount);
          setFreelancerRating(rating.rating);
          console.log(freelancerRating);
        } catch (error) {
          console.error('Error fetching freelancer rating:', error);
        }
      }
    };

    fetchFreelancerRating();
  }, [selectedAccount]); // Depend on selectedAccount

  // Handle the send request button click
  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const response = await sendRequest(id, freelancerRating, selectedAccount); // Call sendRequest with project ID and freelancer rating
      if (response.success) {
        console.log('Request sent successfully:', response.message);
      } else {
        console.error('Error sending request:', response.message);
      }
    } catch (error) {
      console.error('Error while sending request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="freelancer-project-card">
      <h3>{title}</h3>
      <p>Description: {description}</p>
      <p>Reward: {reward} ETH</p>
      <p>Status: {status}</p>
      <p>Employer: {employer}</p>
      <p>Freelancer Rating: {freelancerRating.toString()} / 5</p> {/* Displaying rating in proper format */}
      <button onClick={handleSendRequest} disabled={loading}>
        {loading ? 'Sending...' : 'Send Request'}
      </button>
    </div>
  );
};

export default FreelancerProjectCard;
