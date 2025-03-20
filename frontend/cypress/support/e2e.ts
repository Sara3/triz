// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES6 syntax
import './commands';

// Configure additional behaviors here
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // This is helpful for errors that are expected or known issues
  console.log('Uncaught exception:', err.message);
  return false;
});

// Set up environment variables for testing
before(() => {
  Cypress.env('apiUrl', 'http://localhost:8000/api');
  
  // Skip the backend check for now
  /*
  // Check if the backend is running (optional)
  cy.request({
    url: Cypress.env('apiUrl'),
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status >= 500) {
      console.warn('WARNING: Backend server may not be running!');
    }
  });
  */
});