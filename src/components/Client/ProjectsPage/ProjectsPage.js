import React, { useEffect, useState } from 'react';
import { fetchUserProjects } from '../../../services/web3';
import ProjectCard from './ProjectCard/ProjectCard';
import { useLocation } from 'react-router-dom';

function ClientProjectsPage() {
  const [projects, setProjects] = useState([]);
  const location = useLocation();
  const { selectedAccount } = location.state || {}; // Retrieve selected account if passed

  useEffect(() => {
    const loadProjects = async () => {
      if (selectedAccount) {
        const userProjects = await fetchUserProjects(selectedAccount); // Pass selectedAccount
        setProjects(userProjects);
      }
    };

    loadProjects(); // Trigger project loading when component mounts
  }, [selectedAccount]);

  return (
    <div>
      <h2>Your Projects</h2>
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <ProjectCard
            key={index}
            projectId={project.id}  // Pass project ID to ProjectCard
            title={project.title}
            description={project.description}
            reward={project.reward}
            status={project.status}
            employer={project.employer}
          />
        ))
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
}

export default ClientProjectsPage;
