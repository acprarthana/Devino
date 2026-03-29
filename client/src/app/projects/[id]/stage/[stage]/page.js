"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { submitStageCode, getStageSubmissions } from "../../../../../services/api";

const STAGES = ["frontend","backend","database","auth","deploy"];

export default function StagePage() {
  const { id, stage } = useParams();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");
  const [approved, setApproved] = useState(false);

  const stageIndex = STAGES.indexOf(stage);
  const nextStage = STAGES[stageIndex + 1];

  const handleSubmit = async () => {
    if (!code.trim()) { setError("Please enter your code"); return; }
    setLoading(true);
    setError("");
    setFeedback(null);
    try {
      const res = await submitStageCode(id, stage, { code });
      setFeedback(res.data.feedback);
      setApproved(res.data.approved);
    } catch(err) {
      setError(err.response?.data?.message || "Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setCode("");
    setFeedback(null);
    setError("");
    setApproved(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#f0ece4", padding:"100px 48px 60px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom:48 }}>
          <button onClick={() => router.push(`/projects/${id}`)}
            style={{ background:"transparent", border:"none", color:"#6b6560", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.12em", cursor:"pointer", padding:0, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
            ← BACK TO PROJECT
          </button>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.68rem", color:"#c0392b", letterSpacing:"0.2em", marginBottom:12 }}>
            STAGE {stageIndex + 1} OF 5
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"4rem", color:"#f0ece4", margin:0, lineHeight:1, textTransform:"uppercase" }}>
            {stage} Stage
          </h1>

          {/* Stage progress bar */}
          <div style={{ display:"flex", gap:4, marginTop:24 }}>
            {STAGES.map((s,i) => (
              <div key={s} style={{ flex:1, height:3, background: i<=stageIndex?"#c0392b":"#1a1a1a", transition:"background 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Code Input */}
        {!approved && (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.62rem", color:"#3a3530", letterSpacing:"0.15em", marginBottom:12 }}>
              YOUR CODE
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={`// Paste your ${stage} code here...`}
              style={{
                width:"100%", height:360,
                background:"#0a0a0a", color:"#f0ece4",
                border:"1px solid #1a1a1a", padding:24,
                fontFamily:"'JetBrains Mono',monospace", fontSize:"0.82rem",
                lineHeight:1.7, resize:"vertical", outline:"none",
                borderRadius:0
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding:"12px 16px", border:"1px solid #c0392b", background:"#0e0303", color:"#c0392b", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", marginBottom:20 }}>
            {error}
          </div>
        )}

        {/* AI Feedback */}
        {feedback && (
          <div style={{ marginBottom:32, padding:28, border:`1px solid ${approved?"#27ae60":"#c0392b"}`, background: approved?"#030e05":"#0e0303" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.62rem", color: approved?"#27ae60":"#c0392b", letterSpacing:"0.15em", marginBottom:16 }}>
              {approved ? "AI VALIDATION PASSED" : "AI VALIDATION FAILED"}
            </div>
            <p style={{ fontFamily:"'Instrument Serif',Georgia,serif", color:"#f0ece4", lineHeight:1.8, fontSize:"0.95rem", fontStyle:"italic", margin:0 }}>
              {feedback}
            </p>

            {approved && nextStage && (
              <button onClick={() => router.push(`/projects/${id}/stage/${nextStage}`)}
                style={{ marginTop:24, background:"#27ae60", color:"#fff", border:"none", padding:"12px 32px", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" }}>
                Continue to {nextStage.toUpperCase()} →
              </button>
            )}
            {approved && !nextStage && (
              <button onClick={() => router.push(`/projects/${id}`)}
                style={{ marginTop:24, background:"#27ae60", color:"#fff", border:"none", padding:"12px 32px", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" }}>
                Project Complete! View Summary
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display:"flex", gap:14 }}>
          {!approved && (
            <button onClick={handleSubmit} disabled={loading}
              style={{ background:loading?"#3a3530":"#c0392b", color:"#fff", border:"none", padding:"14px 40px", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.75rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:loading?"not-allowed":"pointer", transition:"all 0.2s" }}>
              {loading ? "AI IS REVIEWING..." : "Submit for AI Review"}
            </button>
          )}
          {feedback && !approved && (
            <button onClick={handleRetry}
              style={{ background:"transparent", color:"#f0ece4", border:"1px solid #1a1a1a", padding:"14px 40px", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.75rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" }}>
              Retry
            </button>
          )}
        </div>

      </div>
    </div>
  );
}