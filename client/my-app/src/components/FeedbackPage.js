import React, { useState } from "react";
import "../styles/FeedbackPage.css"; 

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [username, setUsername] = useState("");

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log("Username:", username);
    console.log("Feedback:", feedback);
  
    setFeedback("");
    setUsername("");
    alert("Thank you for your feedback!");
  };

  return (
    <div className="feedback-container">
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            name="feedback"
            value={feedback}
            onChange={handleFeedbackChange}
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
