// // RequestCard.js
// import React from 'react';

// function RequestCard({ request }) {
//   return (
//     <div className="request-card">
//       <p>Request ID: {request.requestId}</p>
//       <p>Project ID: {request.projectId}</p>
//       <p>Freelancer: {request.freelancer}</p>
//       <p>Freelancer Rating: {request.freelancerRating}</p>
//       <p>Status: {request.status}</p>
//       <p>Escrow Contract: {request.escrowContract}</p>
//     </div>
//   );
// }

// export default RequestCard;

import React from 'react';
import { acceptRequest, rejectRequest } from '../../../../services/web3';

function RequestCard({ request, employer, projectReward }) {
  const handleAccept = async () => {
    try {
      await acceptRequest(request.requestId, employer, projectReward);
      alert('Request accepted successfully');
    } catch (error) {
      alert('Error accepting request');
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest(request.requestId, employer);
      alert('Request rejected successfully');
    } catch (error) {
      alert('Error rejecting request');
      console.error(error);
    }
  };

  return (
    <div className="request-card">
      <p>Request ID: {request.requestId}</p>
      <p>Project ID: {request.projectId}</p>
      <p>Freelancer: {request.freelancer}</p>
      <p>Freelancer Rating: {request.freelancerRating}</p>
      <p>Status: {request.status}</p>
      <p>Escrow Contract: {request.escrowContract}</p>
      
      {/* Accept and Decline buttons */}
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleReject}>Decline</button>
    </div>
  );
}

export default RequestCard;