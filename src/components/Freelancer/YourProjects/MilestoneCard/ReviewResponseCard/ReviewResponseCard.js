import React from 'react';

function ReviewResponseCard({ response }) {
    return (
        <div className="review-response-card">
            <p>Response ID: {response.responseId}</p>
            <p>Milestone ID: {response.milestoneId}</p>
            <p>Freelancer: {response.freelancer}</p>
            <p>Response: {response.response}</p>
            <p>Accepted: {response.accepted ? "Yes" : "No"}</p>
        </div>
    );
}

export default ReviewResponseCard;
