describe('Backend Integration Tests', () => {
  // Test API integration with TrizPrinciplesList component
  it('loads and displays TRIZ principles from the API', () => {
    // Intercept the TRIZ principles API call
    cy.intercept('GET', '**/api/triz/principles/**', {
      statusCode: 200,
      body: [
        {
          id: 1,
          number: 1,
          name: 'Segmentation',
          description: 'Divide an object into independent parts.',
          examples: 'Example: A sectional sofa, modular furniture.'
        },
        {
          id: 2,
          number: 2,
          name: 'Taking out',
          description: 'Extract the disturbing part or property from an object.',
          examples: 'Example: Use a library of inserts for specific functions in a process.'
        }
      ]
    }).as('trizPrinciples');
    
    cy.visit('/');
    
    // Wait for the API call to complete
    cy.wait('@trizPrinciples');
    
    // Verify TRIZ principles are displayed
    cy.contains('h2', 'TRIZ Principles').should('be.visible');
    cy.contains('1. Segmentation').should('be.visible');
    cy.contains('2. Taking out').should('be.visible');
  });

  // Test error handling in API integration
  it('handles API errors gracefully', () => {
    // Mock a failed response
    cy.intercept('GET', '**/api/triz/principles/**', {
      statusCode: 500,
      body: 'Server error'
    }).as('apiError');
    
    cy.visit('/');
    
    // Wait for the API call
    cy.wait('@apiError');
    
    // Verify error message is displayed
    cy.contains('Error:').should('be.visible');
  });
  
  // Test navigation and routing
  it('navigates to different routes correctly', () => {
    cy.visit('/');
    
    // Test navigation to principles page
    cy.visit('/principles');
    cy.url().should('include', '/principles');
    
    // Test navigation to 404 page
    cy.visit('/non-existent-route');
    cy.contains('Page Not Found').should('be.visible');
  });
}); 