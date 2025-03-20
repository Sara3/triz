/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// ***********************************************
// This commands file contains custom commands for testing
// the patent analytics application.
// ***********************************************

// Add type definitions
declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): void;
    testApiConnection(endpoint: string): Chainable<Cypress.Response<unknown>>;
    checkBackendStatus(): Chainable<boolean>;
    loadTestData(endpoint: string, alias: string): void;
  }
}

// Login command - can be used if you implement authentication later
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/login');
    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('form').submit();
    cy.url().should('not.include', '/login');
  });
});

// Command to test API connection
Cypress.Commands.add('testApiConnection', (endpoint: string) => {
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl') || 'http://localhost:8000/api'}${endpoint}`,
    failOnStatusCode: false,
  }).then((response) => {
    return response;
  });
});

// Command to check if backend is up
Cypress.Commands.add('checkBackendStatus', () => {
  cy.request({
    method: 'GET',
    url: Cypress.env('apiUrl') || 'http://localhost:8000/api',
    failOnStatusCode: false,
  }).then((response) => {
    // We're just checking if the server responds, not if it returns 200
    return response.status < 500;
  });
});

// Command to load the test data
Cypress.Commands.add('loadTestData', (endpoint: string, alias: string) => {
  cy.intercept('GET', `**/api${endpoint}/**`).as(alias);
  cy.visit('/');
  cy.wait(`@${alias}`);
});