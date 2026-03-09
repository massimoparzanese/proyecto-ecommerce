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
     * Custom command to setup common API mocks (products, categories, auth/me)
     * @param authState - Authentication state: 'authenticated-user', 'authenticated-admin', or 'unauthenticated' (default)
     * @example cy.mockCommonAPIs()
     * @example cy.mockCommonAPIs('authenticated-admin')
     */
    mockCommonAPIs(
      authState?:
        | 'authenticated-user'
        | 'authenticated-admin'
        | 'unauthenticated'
    ): Chainable<void>;
  }
}
