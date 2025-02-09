document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const sidebarToggle = document.createElement('button');
  sidebarToggle.classList.add('sidebar-toggle');
  sidebarToggle.innerHTML = '☰';
  document.body.appendChild(sidebarToggle);

  sidebarToggle.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
  });

  // Micro-interactions
  const menuItems = document.querySelectorAll('.sidebar-menu a');
  menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(5px)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateX(0)';
    });
  });

  // Demo Functionality
  const originalEstimate = document.getElementById('original-estimate');
  const correctedEstimate = document.getElementById('corrected-estimate');
  const recommendationsList = document.getElementById('recommendations-list');
  const approvalLikelihood = document.getElementById('approval-likelihood');
  const complianceScore = document.getElementById('compliance-score');
  const autoCorrectBtn = document.getElementById('auto-correct-btn');

  if (autoCorrectBtn) {
    autoCorrectBtn.addEventListener('click', () => {
      const correctedData = JSON.parse(originalEstimate.textContent);

      // Apply corrections
      correctedData.operations.push({ name: 'Blend Adjacent Panel', hours: 1.5 });
      correctedData.parts[0].type = 'Aftermarket';
      correctedData.parts[0].cost = 350.00;

      // Display corrected estimate
      correctedEstimate.textContent = JSON.stringify(correctedData, null, 2);

      // Display recommendations
      const recommendations = [
        'Use aftermarket parts to reduce costs',
        'Add blend operation for color match'
      ];
      recommendationsList.innerHTML = recommendations
        .map(rec => `<li>${rec}</li>`)
        .join('');

      // Update metrics
      approvalLikelihood.textContent = '85%';
      complianceScore.textContent = '95%';
    });
  }
}); 