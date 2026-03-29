import { useState } from 'react';
import { submitStageCode } from '../../services/api';

export default function CodeSubmission({ projectId, onFeedback }) {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [stage, setStage] = useState('1');
  const [projectContext, setProjectContext] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await submitStageCode(projectId, stage, {
        codeSnippet,
        files: [],
        context: projectContext ? { notes: projectContext } : {},
      });
      onFeedback(response.data.aiResult || response.data.submission || {});
    } catch (error) {
      console.error('Submission failed:', error);
      alert(error.response?.data?.message || 'Failed to submit code for review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="code-submission"> 
      <h3>Submit Code for AI Review</h3>

      <label>
        Code Snippet:
        <textarea
          value={codeSnippet} 
          onChange={(e) => setCodeSnippet(e.target.value)} 
          required 
        />
      </label>
      <label>
        Project Stage:
        <input
          type="text"
          value={stage} 
          onChange={(e) => setStage(e.target.value)} 
          required 
        />
      </label>

      <label>
        Project Context:
        <textarea
          value={projectContext}
          onChange={(e) => setProjectContext(e.target.value)} 
        />
      </label>

      <button type="submit" disabled={loading}> 
        {loading ? 'Submitting...' : 'Submit for Review'} 
      </button>
    </form>
  );
}