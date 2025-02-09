document.addEventListener('DOMContentLoaded', () => {
  const originalEstimate = document.getElementById('original-estimate');
  const correctedEstimate = document.getElementById('corrected-estimate');
  const recommendationsList = document.getElementById('recommendations-list');
  const approvalLikelihood = document.getElementById('approval-likelihood');
  const complianceScore = document.getElementById('compliance-score');
  const autoCorrectBtn = document.getElementById('auto-correct-btn');

  // Example data
  const exampleCorrections = [
    { operation: 'Add Blend Adjacent Panel', hours: 1.5 },
    { part: 'Fender', type: 'Aftermarket', cost: 350.00 }
  ];

  const exampleRecommendations = [
    'Use aftermarket parts to reduce costs.',
    'Add blend operation for color match.'
  ];

  const exampleApprovalLikelihood = 85;
  const exampleComplianceScore = 95;

  // Auto-Correction Button
  autoCorrectBtn.addEventListener('click', () => {
    const correctedData = JSON.parse(originalEstimate.textContent);

    // Apply corrections
    correctedData.operations.push({ name: 'Blend Adjacent Panel', hours: 1.5 });
    correctedData.parts[0].type = 'Aftermarket';
    correctedData.parts[0].cost = 350.00;

    // Display corrected estimate
    correctedEstimate.textContent = JSON.stringify(correctedData, null, 2);

    // Display recommendations
    recommendationsList.innerHTML = exampleRecommendations
      .map(rec => `<li>${rec}</li>`)
      .join('');

    // Display approval likelihood
    approvalLikelihood.textContent = `${exampleApprovalLikelihood}%`;

    // Display compliance score
    complianceScore.textContent = `${exampleComplianceScore}%`;
  });
}); 