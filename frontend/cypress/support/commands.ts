import {
  mockProducts,
  mockCategories,
  mockUsers,
  MOCK_OBJECT_IDS,
} from '../fixtures/mockData';

Cypress.Commands.add(
  'loginProgrammatic',
  (email: string, role: 'user' | 'admin' = 'user') => {
    cy.window().then(win => {
      // Write a persisted redux state so app picks up session via redux-persist
      const userId =
        role === 'admin' ? MOCK_OBJECT_IDS.admin1 : MOCK_OBJECT_IDS.user1;
      const auth = {
        user: { id: userId, name: email.split('@')[0], role },
        token: null,
        isLoggedIn: true,
      };
      const root = { auth: JSON.stringify(auth) };
      win.localStorage.setItem('persist:root', JSON.stringify(root));
    });
  }
);

// Helper command to setup common mocks
Cypress.Commands.add('mockCommonAPIs', () => {
  // Mock products list
  cy.intercept('GET', '**/products', {
    statusCode: 200,
    body: mockProducts,
  }).as('getProducts');

  // Mock individual products
  mockProducts.forEach(product => {
    cy.intercept('GET', `**/products/${product.id}`, {
      statusCode: 200,
      body: product,
    }).as(`getProduct${product.id}`);
  });

  // Mock categories
  cy.intercept('GET', '**/products/categories', {
    statusCode: 200,
    body: mockCategories,
  }).as('getCategories');
});

export {};
