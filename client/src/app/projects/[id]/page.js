"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject } from "../../../services/api";

const STAGES = ["frontend","backend","database","auth","deploy"];
const STAGE_LABELS = ["Frontend","Backend","Database","Auth","Deploy"];

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProject(id);
        setProject(res.data.project);
      } catch(err) {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const getStageStatus = (stage) => {
    if (!project) return "locked";
    const currentIndex = STAGES.indexOf(project.currentStage);
    const stageIndex = STAGES.indexOf(stage);
    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "current";
    return "locked";
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", color:"#c0392b", letterSpacing:"0.2em" }}>LOADING PROJECT...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", color:"#c0392b" }}>{error}</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#f0ece4", padding:"100px 48px 60px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom:64 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.68rem", color:"#c0392b", letterSpacing:"0.2em", marginBottom:12 }}>PROJECT</div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"4rem", color:"#f0ece4", margin:0, lineHeight:1, textTransform:"uppercase" }}>{project?.projectType}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:24, marginTop:20 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem", color:"#6b6560", letterSpacing:"0.1em" }}>
              PROGRESS: <span style={{ color:"#c0392b" }}>{project?.progressPercentage || 0}%</span>
            </div>
            <div style={{ flex:1, height:2, background:"#1a1a1a", maxWidth:300 }}>
              <div style={{ height:"100%", background:"#c0392b", width:`${project?.progressPercentage || 0}%`, transition:"width 0.5s" }} />
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem", color:"#6b6560", letterSpacing:"0.1em" }}>
              CURRENT: <span style={{ color:"#f0ece4", textTransform:"uppercase" }}>{project?.currentStage}</span>
            </div>
          </div>
        </div>

        {/* Stage Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", border:"1px solid #1a1a1a", marginBottom:48 }}>
          {STAGES.map((stage, i) => {
            const status = getStageStatus(stage);
            const isClickable = status === "current" || status === "completed";
            return (
              <div key={stage}
                onClick={() => isClickable && router.push(`/projects/${id}/stage/${stage}`)}
                style={{
                  padding:"36px 24px",
                  borderRight: i<4?"1px solid #1a1a1a":"none",
                  background: status==="current"?"#0e0e0e": status==="completed"?"#0a0a0a":"#080808",
                  cursor: isClickable?"pointer":"not-allowed",
                  transition:"all 0.3s",
                  position:"relative",
                  opacity: status==="locked"?0.4:1
                }}>

                {/* Status indicator */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color: status==="current"?"#c0392b": status==="completed"?"#27ae60":"#3a3530", letterSpacing:"0.12em" }}>
                    0{i+1}
                  </span>
                  <div style={{ fontSize:"1rem" }}>
                    {status==="completed" ? "✓" : status==="current" ? "●" : "🔒"}
                  </div>
                </div>

                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.55rem", color:"#3a3530", letterSpacing:"0.1em", marginBottom:8, textTransform:"uppercase" }}>
                  {status}
                </div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem", color: status==="current"?"#f0ece4": status==="completed"?"#27ae60":"#5a5a5a", margin:0, letterSpacing:"0.04em" }}>
                  {STAGE_LABELS[i]}
                </h3>

                {status==="current" && (
                  <div style={{ marginTop:16, padding:"6px 12px", background:"#c0392b", display:"inline-block" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#fff", letterSpacing:"0.1em" }}>START</span>
                  </div>
                )}
                {status==="completed" && (
                  <div style={{ marginTop:16, padding:"6px 12px", border:"1px solid #27ae60", display:"inline-block" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#27ae60", letterSpacing:"0.1em" }}>REVIEW</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Back button */}
        <button onClick={() => router.push("/dashboard")}
          style={{ background:"transparent", color:"#6b6560", border:"1px solid #1a1a1a", padding:"12px 28px", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}