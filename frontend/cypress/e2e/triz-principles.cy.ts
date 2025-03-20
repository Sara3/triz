describe('TRIZ Principles Page', () => {
  // Common setup function for API stub
  const setupApiStub = (options = {}) => {
    // Using a more specific pattern to match the exact endpoint
    cy.intercept('GET', '**/api/triz/principles/', {
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
        },
        {
          id: 3,
          number: 3,
          name: 'Local quality',
          description: 'Change an object\'s structure from uniform to non-uniform.',
          examples: 'Example: Pencil eraser, temperature gradient.'
        }
      ],
      ...options
    }).as('getTrizPrinciples');
  };

  it('displays the TRIZ principles heading', () => {
    setupApiStub();
    cy.visit('/');
    cy.contains('h2', 'TRIZ Principles').should('be.visible');
  });

  it('should display loading state initially', () => {
    // Instead of trying to see the loading state by delaying the response,
    // we'll use a cy.stub approach for a more reliable test
    cy.visit('/', {
      onBeforeLoad(win) {
        // Stub the fetch API to delay the response
        cy.stub(win, 'fetch').callsFake(() => {
          return new Promise(resolve => {
            // This creates a longer delay so we can see the loading state
            setTimeout(() => {
              resolve({
                ok: true,
                json: () => Promise.resolve([]),
                status: 200,
                statusText: 'OK'
              });
            }, 1000);
          });
        });
      }
    });
    
    // Check for loading state
    cy.contains('Loading TRIZ principles...').should('be.visible');
  });

  it('should display principles after loading', () => {
    setupApiStub();
    cy.visit('/');
    
    // Wait for network request to complete
    cy.wait('@getTrizPrinciples');
    
    // Check that the container exists
    cy.get('.grid').should('exist');
    
    // Use a more specific selector to find just the principle cards
    cy.get('.grid > .p-4.border.rounded-lg').should('have.length', 3);
    
    // Check for specific text in the principles
    cy.contains('Segmentation').should('be.visible');
    cy.contains('Taking out').should('be.visible');
    cy.contains('Divide an object into independent parts.').should('be.visible');
  });

  it('should handle errors properly', () => {
    // Create an intercept that returns an error
    cy.intercept('GET', '**/api/triz/principles/', {
      statusCode: 500,
      body: 'Server error'
    }).as('errorRequest');
    
    cy.visit('/');
    
    // Check for error message - we don't need to wait for the request
    // since Cypress automatically waits for assertions
    cy.contains('Error:').should('be.visible');
  });
}); 