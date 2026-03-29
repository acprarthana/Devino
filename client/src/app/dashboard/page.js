"use client";
import { useEffect, useState } from 'react';
import CodeSubmission from './code-submission';
import AIFeedback from './ai-feedback';
import { listProjects } from '../../services/api';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleFeedback = (newFeedback) => {
    setFeedback(newFeedback);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await listProjects();
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  return (
    <div style={{ padding: "40px" }}>
      <h1>Project Dashboard</h1>
      {loading && <p>Loading projects...</p>}
      {!loading && projects.length === 0 && <p>No projects found.</p>}
      {projects.map((project) => (
        <div
          key={project._id}
          style={{
            marginBottom: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>{project.projectType}</h3>
          <p>Current Stage:{project.currentStage}</p>
          <p>Progress: {project.progressPercentage}%</p>
          <div
            style={{
              width: "100%",
              backgroundColor: "#eee",
              height: "10px",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                width: `${project.progressPercentage}%`,
                backgroundColor: "green",
                height: "10px",
                borderRadius: "5px",
              }}
            />
          </div>
          <CodeSubmission projectId={project._id} onFeedback={handleFeedback} />
          <AIFeedback feedback={feedback} /> 
        </div>
      ))}
    </div>
  );
}
