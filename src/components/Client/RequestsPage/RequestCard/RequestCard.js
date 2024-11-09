// src/components/Client/RequestCard/RequestCard.js
import React from 'react';

function RequestCard({ requestId, projectId, freelancer, freelancerRating, status, escrowContract }) {
  return (
    <div className="request-card">
      <h3>Request ID: {requestId}</h3>
      <p><strong>Project ID:</strong> {projectId}</p>
      <p><strong>Freelancer:</strong> {freelancer}</p>
      <p><strong>Freelancer Rating:</strong> {freelancerRating}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Escrow Contract:</strong> {escrowContract}</p>
      {/* Add any additional actions or buttons here if needed */}
    </div>
  );
}

export default RequestCard;
