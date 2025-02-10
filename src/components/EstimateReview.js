import React, { useState } from 'react';

const EstimateReview = () => {
  const [estimate, setEstimate] = useState(null);

  const handleSubmit = async () => {
    const response = await fetch('/api/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estimate),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <h2>Estimate Review</h2>
      <button onClick={handleSubmit}>Submit Estimate</button>
    </div>
  );
};

export default EstimateReview; 