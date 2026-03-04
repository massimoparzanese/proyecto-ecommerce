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
      cy.loginProgrammatic('admin@test.com', 'admin');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica', 'Ropa'],
      }).as('getCategories');

      cy.intercept('POST', '**/products', {
        statusCode: 401,
        body: {
          message: 'No autorizado',
        },
      }).as('unauthorized');

      cy.visit('/admin/product');
      cy.wait('@getCategories', { timeout: 10000 });

      cy.get('#name', { timeout: 5000 }).type('Test Product');
      cy.get('#description').type('Description');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#category').select(1);
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
    it('should handle network timeout errors', () => {
      cy.intercept('GET', '**/products', req => {
        req.destroy(); // Simulates network error
      }).as('networkError');

      cy.visit('/');
      cy.wait('@networkError');

      // Should show network error message
      cy.contains(/error.*red/i).should('be.visible');
    });

    it('should handle complete network failure', () => {
      cy.intercept('GET', '**/products', {
        forceNetworkError: true,
      }).as('networkFailure');

      cy.visit('/');
      cy.wait('@networkFailure');

      cy.contains(/error/i).should('be.visible');
    });

    it('should handle DNS resolution errors', () => {
      // Change API base URL to invalid domain
      cy.intercept('GET', '**/products', {
        forceNetworkError: true,
      }).as('dnsError');

      cy.visit('/');
      cy.wait('@dnsError');

      cy.contains(/error/i).should('be.visible');
    });
  });

  describe('AbortController - Request Cancellation', () => {
    it('should cancel ongoing requests when navigating away', () => {
      cy.intercept('GET', '**/products', req => {
        req.reply({
          delay: 2000,
          statusCode: 200,
          body: [],
        });
      }).as('slowProducts');

      cy.visit('/');

      // Navigate away before request completes
      cy.wait(500);
      cy.visit('/login');

      // Original request should be aborted
      // No error should be shown since it was intentionally cancelled
    });

    it('should cancel requests when component unmounts', () => {
      cy.intercept('GET', '**/products/categories', req => {
        req.reply({
          delay: 3000,
          statusCode: 200,
          body: ['Category'],
        });
      }).as('slowCategories');

      cy.loginProgrammatic('admin@test.com', 'admin');
      cy.visit('/admin/product');

      // Navigate back before categories load
      cy.wait(500);
      cy.go('back');

      // Should not show any errors from cancelled request
      cy.contains(/error.*categor/i).should('not.exist');
    });
  });

  describe('Response Data Validation', () => {
    it('should handle missing required fields in response', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Success',
          data: {
            // Missing id and role
            name: 'User',
            email: 'user@example.com',
          },
        },
      }).as('incompleteData');

      cy.visit('/login');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      cy.wait('@incompleteData');
      // LoginPage validates that id and role exist and shows error toast
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'Respuesta del servidor incompleta');
    });

    it('should handle unexpected data format', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          // Missing data field entirely
          message: 'Success',
        },
      }).as('unexpectedFormat');

      cy.visit('/login');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      cy.wait('@unexpectedFormat');
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /servidor incompleta|error/i);
    });
  });

  describe('Error Recovery', () => {
    it('should allow retry after failed request', () => {
      let attemptCount = 0;

      cy.intercept('POST', '**/auth/login', req => {
        attemptCount++;
        if (attemptCount === 1) {
          req.reply({
            statusCode: 500,
            body: { message: 'Server error' },
          });
        } else {
          req.reply({
            statusCode: 201,
            body: {
              message: 'Success',
              data: {
                id: MOCK_OBJECT_IDS.user1,
                name: 'User',
                email: 'user@test.com',
                role: 'user',
              },
            },
          });
        }
      }).as('retryLogin');

      cy.visit('/login');

      // First attempt fails
      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();
      cy.wait('@retryLogin');
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /error/i);

      // Wait for toast to dismiss and button to be enabled
      cy.wait(1000);
      cy.get('button[type="submit"]').should('not.be.disabled');

      // Retry should work
      cy.get('button[type="submit"]').click();
      cy.wait('@retryLogin');
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');
    });

    it('should clear previous errors on successful request', () => {
      let requestCount = 0;

      cy.intercept('POST', '**/auth/login', req => {
        requestCount++;
        if (requestCount === 1) {
          req.reply({
            statusCode: 401,
            body: { message: 'Credenciales inválidas' },
          });
        } else {
          req.reply({
            statusCode: 201,
            body: {
              message: 'Success',
              data: {
                id: MOCK_OBJECT_IDS.user1,
                name: 'User',
                email: 'user@test.com',
                role: 'user',
              },
            },
          });
        }
      }).as('login');

      cy.visit('/login');

      // First attempt fails
      cy.get('#email').type('wrong@example.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.wait('@login');
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'Credenciales inválidas');

      // Wait for button to be re-enabled
      cy.wait(1000);
      cy.get('button[type="submit"]').should('not.be.disabled');

      // Second attempt succeeds
      cy.get('#email').clear().type('user@example.com');
      cy.get('#password').clear().type('correctpassword');
      cy.get('button[type="submit"]').click();
      cy.wait('@login');

      // Should redirect successfully
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');
    });
  });

  describe('Loading States During Errors', () => {
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
      cy.get('button[type="submit"]').click({ force: true });

      cy.wait('@validationError');

      // Should display the specific reason in toast
      cy.get('[data-sonner-toast]', { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /10 caracteres|secuencias/i);
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
