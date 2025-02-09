describe('Estimate Processing', () => {
  it('should process an estimate with AI', () => {
    cy.visit('/');
    cy.get('#upload').attachFile('estimate.pdf');
    cy.get('#process').click();
    cy.contains('Estimate processed successfully').should('be.visible');
  });

  it('should validate estimate compliance', () => {
    cy.visit('/');
    cy.get('#upload').attachFile('estimate.pdf');
    cy.get('#validate').click();
    cy.contains('Estimate compliant').should('be.visible');
  });
}); 