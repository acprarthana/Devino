"use client";
import { useEffect, useState } from "react";
export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div style={{ padding: "40px" }}>
      <h1>Project Dashboard</h1>
      {projects.length === 0 && <p>No projects found.</p>}
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
        </div>
      ))}
    </div>
  );
}
