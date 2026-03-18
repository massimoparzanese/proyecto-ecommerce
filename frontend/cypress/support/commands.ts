import { mockProducts, mockCategories, mockUsers } from '../fixtures/mockData';

Cypress.Commands.add(
  'loginProgrammatic',
  (email: string, role: 'user' | 'admin' = 'user') => {
    // Use mocked user data
    const userData = role === 'admin' ? mockUsers.admin : mockUsers.user;

    cy.window().then(win => {
      // Write a persisted redux state so app picks up session via redux-persist
      const auth = {
        user: userData,
        token: null,
        isLoggedIn: true,
      };
      const cart = {
        items: {},
      };
      const root = { auth: JSON.stringify(auth), cart: JSON.stringify(cart) };
      win.localStorage.setItem('persist:root', JSON.stringify(root));
    });
  }
);

// Helper command to setup common mocks
Cypress.Commands.add(
  'mockCommonAPIs',
  (
    authState?: 'authenticated-user' | 'authenticated-admin' | 'unauthenticated'
  ) => {
    // Default to unauthenticated
    const state = authState || 'unauthenticated';

    // Mock auth/me based on state
    if (state === 'authenticated-user') {
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: mockUsers.user,
        },
      }).as('authMe');
    } else if (state === 'authenticated-admin') {
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: mockUsers.admin,
        },
      }).as('authMe');
    } else {
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: {
          message: 'No hay sesión activa',
          data: null,
        },
      }).as('authMe');
    }

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
  }
);

export {};
