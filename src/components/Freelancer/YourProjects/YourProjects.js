// // delance/src/components/YourProjects.js
// import React, { useEffect, useState } from 'react';
// import { fetchAcceptedProjectsByFreelancer } from '../../../services/web3';
// import YourProjectCard from './ProjectsCard/ProjectCard'; // Import ProjectCard component

// function YourProjects() {
//   const [projects, setProjects] = useState([]);
//   const freelancer = localStorage.getItem('selectedAccount');

//   useEffect(() => {
//     if (freelancer) {
//       loadProjects();
//     }
//   }, [freelancer]);

//   const loadProjects = async () => {
//     try {
//       const result = await fetchAcceptedProjectsByFreelancer(freelancer);
//       setProjects(result);
//     } catch (error) {
//       console.error("Error loading projects:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Your Accepted Projects</h2>
//       {projects.length > 0 ? (
//         projects.map((project) => (
//           <YourProjectCard key={project.id} project={project} /> // Use ProjectCard to display each project
//         ))
//       ) : (
//         <p>No accepted projects to display.</p>
//       )}
//     </div>
//   );
// }

// export default YourProjects;


// delance/src/components/YourProjects.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import { fetchAcceptedProjectsByFreelancer } from '../../../services/web3';
import YourProjectCard from './ProjectsCard/ProjectCard'; // Import ProjectCard component

function YourProjects() {
  const [projects, setProjects] = useState([]);
  const location = useLocation(); // Use the useLocation hook
  const freelancer = location.state?.selectedAccount || localStorage.getItem('selectedAccount');

  useEffect(() => {
    if (freelancer) {
      loadProjects();
    }
  }, [freelancer]);

  const loadProjects = async () => {
    try {
      const result = await fetchAcceptedProjectsByFreelancer(freelancer);
      setProjects(result);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  return (
    <div>
      <h2>Your Accepted Projects</h2>
      {projects.length > 0 ? (
        projects.map((project) => (
          <YourProjectCard key={project.id} project={project} selectedAccount={freelancer} /> // Pass selectedAccount to ProjectCard
        ))
      ) : (
        <p>No accepted projects to display.</p>
      )}
    </div>
  );
}

export default YourProjects;

