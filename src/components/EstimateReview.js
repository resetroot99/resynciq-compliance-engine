function EstimateReview({ estimate }) {
  return (
    <div className="estimate-review">
      <h2>Estimate Review</h2>
      <div className="compliance-status">
        <span>Compliance: {estimate.complianceScore}%</span>
        <span>Approval Probability: {estimate.approvalProbability}%</span>
      </div>
      <div className="recommendations">
        <h3>Recommendations</h3>
        {estimate.recommendations.map((rec, i) => (
          <div key={i} className="recommendation">
            <p>{rec.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EstimateReview; 