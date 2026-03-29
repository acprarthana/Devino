"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../../services/api";

export default function CreateProject() {
  const router = useRouter();
  const [projectType, setProjectType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const templates = [
    { id: "portfolio", label: "Portfolio Website", desc: "Personal portfolio with projects showcase" },
    { id: "restaurant", label: "Restaurant Website", desc: "Menu display and reservation system" },
    { id: "ecommerce", label: "E-Commerce Store", desc: "Product catalog and shopping cart" },
  ];

  const handleSubmit = async () => {
    if (!projectType) { setError("Please select a project template"); return; }
    setLoading(true);
    setError("");
    try {
      // For now, use the first stage of the selected project type as templateId
      // This will be updated when issue #18 provides dynamic templates
      const templateId = `${projectType}-stage-1`;
      const res = await createProject({ projectType, templateId });
      router.push(`/projects/${res.data.project._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#f0ece4", padding:"100px 48px 60px" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom:48 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.68rem", color:"#c0392b", letterSpacing:"0.2em", marginBottom:12 }}>NEW PROJECT</div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"4rem", color:"#f0ece4", margin:0, lineHeight:1 }}>SELECT A TEMPLATE</h1>
          <p style={{ fontFamily:"'Instrument Serif',Georgia,serif", color:"#6b6560", fontSize:"1rem", fontStyle:"italic", marginTop:16 }}>
            Choose a project to build. You will be guided through all 5 stages.
          </p>
        </div>

        {/* Templates */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:40 }}>
          {templates.map(t => (
            <div key={t.id}
              onClick={() => setProjectType(t.id)}
              style={{
                padding:28, border:`1px solid ${projectType===t.id?"#c0392b":"#1a1a1a"}`,
                background: projectType===t.id?"#0e0e0e":"#080808",
                cursor:"pointer", transition:"all 0.2s",
                position:"relative"
              }}>
              {projectType===t.id && (
                <div style={{ position:"absolute", top:12, right:12, width:8, height:8, background:"#c0392b", borderRadius:"50%" }} />
              )}
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem", color: projectType===t.id?"#f0ece4":"#6b6560", marginBottom:8 }}>{t.label}</div>
              <div style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"0.88rem", color:"#3a3530", fontStyle:"italic" }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Stages preview */}
        <div style={{ marginBottom:40, padding:24, border:"1px solid #1a1a1a", background:"#0a0a0a" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.62rem", color:"#3a3530", letterSpacing:"0.15em", marginBottom:16 }}>YOU WILL GO THROUGH</div>
          <div style={{ display:"flex", gap:0 }}>
            {["Frontend","Backend","Database","Auth","Deploy"].map((s,i) => (
              <div key={i} style={{ flex:1, textAlign:"center", borderRight:i<4?"1px solid #1a1a1a":"none", padding:"12px 8px" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.55rem", color:"#3a3530", marginBottom:4 }}>0{i+1}</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", color:"#6b6560" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ padding:"12px 16px", border:"1px solid #c0392b", background:"#0e0303", color:"#c0392b", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", marginBottom:20 }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display:"flex", gap:14 }}>
          <button onClick={handleSubmit} disabled={loading}
            style={{ background: loading?"#3a3530":"#c0392b", color:"#fff", border:"none", padding:"14px 40px", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.75rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}>
            {loading ? "Creating..." : "Create Project"}
          </button>
          <button onClick={() => router.back()}
            style={{ background:"transparent", color:"#6b6560", border:"1px solid #1a1a1a", padding:"14px 40px", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.75rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
