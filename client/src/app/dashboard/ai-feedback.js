import { useState } from 'react'; 
export default function AIFeedback({ feedback }) {
  if (!feedback) return <p>No feedback available.</p>; 
  return (
    <div className="ai-feedback"> 
      <h3>AI Code Review Feedback</h3> 

      <div className="review">
        <h4>Review:</h4>
        <p>{feedback.review}</p>
      </div>

      <div className="validation">
        <h4>Stage Completion:</h4>
        <p>{feedback.stageValidation}</p>
      </div>

      <div className="errors">
        <h4>Errors:</h4>
        <ul>
          {feedback.errors.map((error, index) => ( 
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>

      <div className="suggestions">
        <h4>Suggestions:</h4>
        <ul>
          {feedback.suggestions.map((suggestion, index) => ( 
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}