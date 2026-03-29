export default function AIFeedback({ feedback }) {
  if (!feedback) return <p>No feedback available.</p>;

  const review = feedback.feedback || feedback.review || 'No summary available';
  const stageValidation = feedback.approved !== undefined ? (feedback.approved ? 'Passed' : 'Failed') : feedback.stageValidation || 'Pending';
  const errors = Array.isArray(feedback.errors) ? feedback.errors : [];
  const suggestions = Array.isArray(feedback.suggestions) ? feedback.suggestions : [];

  return (
    <div className="ai-feedback">
      <h3>AI Code Review Feedback</h3>

      <div className="review">
        <h4>Review:</h4>
        <p>{review}</p>
      </div>

      <div className="validation">
        <h4>Stage Completion:</h4>
        <p>{stageValidation}</p>
      </div>

      <div className="errors">
        <h4>Errors:</h4>
        <ul>
          {errors.length === 0 ? <li>None.</li> : errors.map((error, index) => <li key={index}>{error.message || error}</li>)}
        </ul>
      </div>

      <div className="suggestions">
        <h4>Suggestions:</h4>
        <ul>
          {suggestions.length === 0 ? <li>None.</li> : suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
        </ul>
      </div>
    </div>
  );
}