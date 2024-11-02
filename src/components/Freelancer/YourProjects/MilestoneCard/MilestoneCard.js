// MilestoneCard.js
import React, { useState } from 'react';
import { uploadFiletoIPFS } from '../../../../services/ipfs'; // Adjust the path based on your project structure

function MilestoneCard({ milestone, selectedAccount }) { // Accept selectedAccount as a prop
    console.log(selectedAccount);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null); // For showing the result of the upload

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    try {
      const result = await uploadFiletoIPFS(selectedFile, milestone.id, selectedAccount);
      setUploadResult(result); // Set upload result to display if needed
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <div className="milestone-card">
      <p>Milestone ID: {milestone.id}</p>
      <p>Name: {milestone.name}</p>
      <p>Description: {milestone.description}</p>
      <p>Days to Complete: {milestone.daycount}</p>
      <p>Percentage: {milestone.percentage}%</p>
      <p>Completed: {milestone.completed ? "Yes" : "No"}</p>
      <p>Proof File Hash: {milestone.proofFileHash}</p>

      {/* File Upload Section */}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>

      {/* Display the upload result if needed */}
      {uploadResult && (
        <p>File uploaded to IPFS with hash: {uploadResult.hash}</p>
      )}
    </div>
  );
}

export default MilestoneCard;
