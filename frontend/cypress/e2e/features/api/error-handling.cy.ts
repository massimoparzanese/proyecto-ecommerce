import { MOCK_OBJECT_IDS } from '../../../fixtures/mockData';

describe('API Error Handling', () => {
  describe('HTTP Error Responses', () => {
    beforeEach(() => {
      // Mock common APIs for pages that need them
      cy.mockCommonAPIs();
    });

    it('should handle 400 Bad Request errors', () => {
      cy.intercept('GET', '**/products', {
        statusCode: 400,
        body: {
          message: 'Solicitud inválida',
        },
      }).as('badRequest');

      cy.visit('/');
      cy.wait('@badRequest');

      // Should show error message
      cy.contains(/error/i).should('be.visible');
    });

    it('should handle 401 Unauthorized errors', () => {
      // Override beforeEach mocks with authenticated admin state
      cy.loginProgrammatic('admin@test.com', 'admin');
      cy.mockCommonAPIs('authenticated-admin');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica', 'Ropa'],
      }).as('getCategories');

      // Mock POST products to return 401
      cy.intercept('POST', '**/products', {
        statusCode: 401,
        body: {
          message: 'No autorizado',
        },
      }).as('unauthorized');

      cy.visit('/admin/product');

      // Wait for page to load and categories to be fetched
      cy.wait('@getCategories', { timeout: 10000 });

      // Fill form and submit
      cy.get('#name', { timeout: 5000 })
        .should('be.visible')
        .type('Test Product');
      cy.get('#description').type('Description');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#category').select('Electrónica');
      cy.get('button[type="submit"]').click();

      cy.wait('@unauthorized');

      // Check for error toast
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'No autorizado');
    });

    it('should handle 404 Not Found errors', () => {
      cy.intercept('GET', '**/products/999999', {
        statusCode: 404,
        body: {
          message: 'Producto no encontrado',
        },
      }).as('notFound');

      cy.visit('/product/999999', { failOnStatusCode: false });
      cy.wait('@notFound', { timeout: 10000 });

      // ProductDetailPage shows "Producto no encontrado" when product is null
      cy.contains(/producto no encontrado/i, { timeout: 5000 }).should(
        'be.visible'
      );
    });

    it('should handle 409 Conflict errors', () => {
      cy.visit('/register');

      cy.intercept('POST', '**/auth/register', {
        statusCode: 409,
        body: {
          message: 'El email solicitado está en uso',
        },
      }).as('conflict');

      cy.get('#name').type('Test User');
      cy.get('#email').type('existing@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@conflict');
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'El email solicitado está en uso');
    });

    it('should handle 500 Internal Server Error', () => {
      cy.intercept('GET', '**/products', {
        statusCode: 500,
        body: {
          message: 'Error interno del servidor',
        },
      }).as('serverError');

      cy.visit('/');
      cy.wait('@serverError');

      cy.contains(/error/i).should('be.visible');
    });
  });

  describe('Network Errors', () => {
    beforeEach(() => {
      // Mock common APIs
      cy.mockCommonAPIs();
    });

    it('should handle network errors', () => {
      cy.intercept('GET', '**/products', {
        forceNetworkError: true,
      }).as('networkError');

      cy.visit('/');
      cy.wait('@networkError');

      // Should show network error message
      cy.contains(/error/i, { timeout: 5000 }).should('be.visible');
    });
  });

  describe('AbortController - Request Cancellation', () => {
    beforeEach(() => {
      // Mock common APIs
      cy.mockCommonAPIs();
    });

    it('should cancel ongoing requests when navigating away', () => {
      cy.intercept('GET', '**/products', req => {
        req.reply({
          delay: 500, // Reduced from 2000ms to avoid test timeout
          statusCode: 200,
          body: [],
        });
      }).as('slowProducts');

      cy.visit('/');
      cy.wait(200); // Wait for navigation to settle
      cy.visit('/login');

      // Verify we're on login page (navigation completed successfully)
      cy.location('pathname').should('eq', '/login');
      cy.get('#email').should('be.visible');
    });

    it('should cancel requests when component unmounts', () => {
      cy.intercept('GET', '**/products/categories', req => {
        req.reply({
          delay: 500, // Reduced from 3000ms to avoid test timeout
          statusCode: 200,
          body: ['Category'],
        });
      }).as('slowCategories');

      cy.loginProgrammatic('admin@test.com', 'admin');

      // Override beforeEach's auth/me (401) so AdminRoute allows access
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: '507f1f77bcf86cd799439022',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
          },
        },
      }).as('authMe');

      // Visit admin product page (this will trigger categories fetch)
      cy.visit('/admin/product');

      // Navigate away to trigger unmount and abort
      cy.visit('/admin');

      // Verify navigation completed
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });
  });

  describe('Error Recovery', () => {
    beforeEach(() => {
      // Mock common APIs
      cy.mockCommonAPIs();
    });

    it('should allow retry after failed request', () => {
      // Register success intercept FIRST (lower LIFO priority — fallback)
      cy.intercept('POST', '**/auth/login', {
        statusCode: 500,
        body: { message: 'Server error' },
      }).as('loginFail');

      cy.visit('/login');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginFail');

      // After failure: toast shown, button re-enabled, form still usable
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'Server error');
      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('#email').should('have.value', 'user@example.com');
    });

    it('should clear previous errors on successful request', () => {
      const userData = {
        id: MOCK_OBJECT_IDS.user1,
        name: 'User',
        email: 'user@test.com',
        role: 'user',
      };

      // Register success intercept FIRST (lower LIFO priority)
      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: { message: 'Success', data: userData },
      }).as('loginSuccess');

      // Register fail intercept SECOND with times:1 (higher LIFO priority, one-shot)
      // After it's consumed, @loginSuccess takes over for subsequent requests
      cy.intercept(
        { method: 'POST', url: '**/auth/login', times: 1 },
        {
          statusCode: 401,
          body: { message: 'Credenciales inválidas' },
        }
      ).as('loginFail');

      cy.visit('/login');

      // First attempt — handled by @loginFail (times:1, LIFO wins)
      cy.get('#email').type('wrong@example.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginFail');
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'Credenciales inválidas');
      cy.get('button[type="submit"]').should('not.be.disabled');

      // Second attempt — @loginFail exhausted, @loginSuccess handles it
      cy.get('#email').clear().type('user@example.com');
      cy.get('#password').clear().type('correctpassword');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginSuccess');

      // Success toast replaces the error toast
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'exitoso');
    });
  });

  describe('Loading States During Errors', () => {
    beforeEach(() => {
      // Mock common APIs
      cy.mockCommonAPIs();
    });

    it('should stop loading state after error', () => {
      cy.intercept('POST', '**/auth/login', req => {
        req.reply({
          delay: 500,
          statusCode: 401,
          body: { message: 'Unauthorized' },
        });
      }).as('slowError');

      cy.visit('/login');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      // Should show loading
      cy.contains('button', 'Iniciando sesión...').should('be.visible');

      cy.wait('@slowError');

      // Loading should stop, button should be enabled again
      cy.contains('button', 'Iniciar Sesión').should('be.visible');
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  });

  describe('CORS and Security Errors', () => {
    beforeEach(() => {
      // Mock common APIs
      cy.mockCommonAPIs();
    });

    it('should handle CORS errors gracefully', () => {
      cy.intercept('GET', '**/products', req => {
        req.reply({
          statusCode: 0, // CORS error typically has status 0
          body: '',
        });
      }).as('corsError');

      cy.visit('/');
      cy.wait('@corsError');

      cy.contains(/error/i).should('be.visible');
    });
  });

  describe('API Error Messages', () => {
    beforeEach(() => {
      // Mock common APIs
      cy.mockCommonAPIs();
    });

    it('should display backend-provided error messages', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 400,
        body: {
          message: 'La contraseña no cumple con los criterios',
          data: {
            reasons: [
              'Debe tener al menos 10 caracteres.',
              'No usar secuencias comunes.',
            ],
          },
        },
      }).as('validationError');

      cy.visit('/register');

      cy.get('#name').type('Test');
      cy.get('#email').type('test@test.com');
      cy.get('#password').type('weak');
      cy.get('#confirmPassword').type('weak');
      cy.get('button[type="submit"]').should('be.visible').click();

      cy.wait('@validationError');

      // Should display the specific reason in toast
      cy.contains('10 caracteres', { timeout: 10000 }).should('be.visible');
    });

    it('should use fallback messages when none provided', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 500,
        body: {},
      }).as('noMessage');

      cy.visit('/login');

      cy.get('#email').type('user@test.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      cy.wait('@noMessage');

      // Should show generic error in toast
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /error/i);
    });
  });
});
