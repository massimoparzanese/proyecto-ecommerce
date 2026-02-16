/* eslint-disable @typescript-eslint/no-namespace -- necessary for Cypress global type augmentation */
import './commands';

/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

// Optionally add global hooks here
// Use global namespace augmentation to extend Cypress types.

declare global {
  namespace Cypress {
    interface Chainable {
      loginProgrammatic(
        email: string,
        role?: 'user' | 'admin'
      ): Cypress.Chainable<void>;
    }
  }
}
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

import '@testing-library/cypress/add-commands';

export {};
