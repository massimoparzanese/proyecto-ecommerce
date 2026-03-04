/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login programmatically without UI
     * @param email - User email
     * @param role - User role (user or admin)
     * @example cy.loginProgrammatic('admin@test.com', 'admin')
     */
    loginProgrammatic(email: string, role?: 'user' | 'admin'): Chainable<void>;

    /**
     * Custom command to setup common API mocks (products, categories)
     * @example cy.mockCommonAPIs()
     */
    mockCommonAPIs(): Chainable<void>;
  }
}
