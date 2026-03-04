import { MOCK_OBJECT_IDS } from '../../../fixtures/mockData';

describe('Auth - Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  describe('Page Rendering', () => {
    it('should display register form with all fields', () => {
      cy.contains('Crear Cuenta').should('be.visible');
      cy.get('#name').should('be.visible');
      cy.get('#email').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('#confirmPassword').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show links to login and home', () => {
      cy.contains('a', 'Inicia sesión aquí').should(
        'have.attr',
        'href',
        '/login'
      );
      cy.contains('a', 'Volver al inicio').should('have.attr', 'href', '/');
    });

    it('should have icons for all input fields', () => {
      cy.get('svg').should('have.length.greaterThan', 0);
    });
  });

  describe('Form Validation', () => {
    it('should require name field', () => {
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('#name:invalid').should('exist');
    });

    it('should require email field', () => {
      cy.get('#name').type('Test User');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('#email:invalid').should('exist');
    });

    it('should require valid email format', () => {
      cy.get('#name').type('Test User');
      cy.get('#email').type('invalid-email');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('#email:invalid').should('exist');
    });

    it('should require password field', () => {
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('#password:invalid').should('exist');
    });

    it('should require password confirmation', () => {
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('#confirmPassword:invalid').should('exist');
    });

    it('should show error when passwords do not match', () => {
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('different123');
      cy.get('button[type="submit"]').click();

      cy.contains('Las contraseñas no coinciden').should('be.visible');
    });
  });

  describe('Successful Registration', () => {
    it('registers a new user successfully', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 201,
        body: {
          message: 'User registered',
          data: {
            id: MOCK_OBJECT_IDS.user1,
            email: 'newuser@example.com',
            name: 'Test User',
            role: 'user',
          },
        },
      }).as('registerAPI');

      cy.get('#name').type('Test User');
      cy.get('#email').type('newuser@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');

      cy.get('button[type="submit"]').contains('Crear Cuenta').click();

      cy.wait('@registerAPI');

      // Should show success toast
      cy.contains('¡Registro exitoso!').should('be.visible');

      // Should redirect to home
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');

      // Should be logged in
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
      });
      cy.get('div.absolute.right-0.z-50').within(() => {
        cy.contains('Cerrar Sesión').should('be.visible');
      });
    });

    it('should store user data in Redux persist', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 201,
        body: {
          message: 'User registered',
          data: {
            id: MOCK_OBJECT_IDS.user2,
            email: 'jane@example.com',
            name: 'Jane Doe',
            role: 'user',
          },
        },
      }).as('registerAPI');

      cy.get('#name').type('Jane Doe');
      cy.get('#email').type('jane@example.com');
      cy.get('#password').type('securepass123');
      cy.get('#confirmPassword').type('securepass123');
      cy.get('button[type="submit"]').click();

      cy.wait('@registerAPI');

      // Check localStorage for persisted Redux state
      cy.window().then(win => {
        const persistedState = win.localStorage.getItem('persist:root');
        expect(persistedState).to.exist;

        const parsed = JSON.parse(persistedState!);
        const auth = JSON.parse(parsed.auth);

        expect(auth.user).to.deep.include({
          id: MOCK_OBJECT_IDS.user2,
          name: 'Jane Doe',
          role: 'user',
        });
        expect(auth.isLoggedIn).to.be.true;
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error for email already in use', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 409,
        body: {
          message: 'El email solicitado está en uso',
        },
      }).as('registerError');

      cy.get('#name').type('Test User');
      cy.get('#email').type('existing@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@registerError');

      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'El email solicitado está en uso');
      cy.location('pathname').should('eq', '/register');
    });

    it('should show error for weak password', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 400,
        body: {
          message: 'La contraseña no cumple con los criterios',
          data: {
            reasons: [
              'Debe tener al menos 10 caracteres.',
              'Usa una mezcla de mayúsculas, minúsculas, números y símbolos.',
            ],
          },
        },
      }).as('registerError');

      cy.visit('/register'); // Override beforeEach to ensure clean state

      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      // Use weak password that will fail backend validation
      cy.get('#password').type('weak');
      cy.get('#confirmPassword').type('weak');
      cy.get('button[type="submit"]').click({ force: true });

      cy.wait('@registerError');

      // Should display validation reasons in toast (reasons are joined with '. ')
      cy.get('[data-sonner-toast]', { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /10 caracteres|mayúsculas|minúsculas/i);
    });

    it('should show error for invalid email', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 400,
        body: {
          message: 'Email inválido',
          data: {
            reasons: ['El formato del email no es válido.'],
          },
        },
      }).as('registerError');

      cy.get('#name').type('Test User');
      // Use email format valid for HTML5 but rejected by backend logic
      cy.get('#email').type('invalid@domain');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@registerError');

      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /email|formato/i);
    });

    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '**/auth/register', {
        forceNetworkError: true,
      }).as('networkError');

      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /error/i);
    });

    it('should handle missing response data', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 201,
        body: {
          message: 'Success',
          data: {}, // Missing required fields
        },
      }).as('incompleteResponse');

      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@incompleteResponse');

      cy.contains(/respuesta.*incompleta/i).should('be.visible');
    });
  });

  describe('Loading State', () => {
    it('should show loading state during registration', () => {
      cy.intercept('POST', '**/auth/register', req => {
        req.reply({
          delay: 1000,
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
      }).as('slowRegister');

      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');
      cy.get('button[type="submit"]').click();

      cy.contains('button', 'Creando cuenta...').should('be.visible');
      cy.get('button[type="submit"]').should('be.disabled');

      cy.wait('@slowRegister');
    });

    it('should prevent double submission', () => {
      cy.intercept('POST', '**/auth/register', req => {
        req.reply({
          delay: 1500,
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
      }).as('slowRegister');

      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('password123');
      cy.get('#confirmPassword').type('password123');

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click({ force: true });

      cy.wait('@slowRegister');
      cy.get('@slowRegister.all').should('have.length', 1);
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      cy.contains('a', 'Inicia sesión aquí').click();
      cy.location('pathname').should('eq', '/login');
    });

    it('should navigate to home page', () => {
      cy.contains('a', 'Volver al inicio').click();
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      cy.get('label[for="name"]').should('contain', 'Nombre Completo');
      cy.get('label[for="email"]').should('contain', 'Email');
      cy.get('label[for="password"]').should('contain', 'Contraseña');
      cy.get('label[for="confirmPassword"]').should(
        'contain',
        'Confirmar Contraseña'
      );
    });

    it('should mark all inputs as required', () => {
      cy.get('#name').should('have.attr', 'required');
      cy.get('#email').should('have.attr', 'required');
      cy.get('#password').should('have.attr', 'required');
      cy.get('#confirmPassword').should('have.attr', 'required');
    });

    it('should have proper input types', () => {
      cy.get('#name').should('have.attr', 'type', 'text');
      cy.get('#email').should('have.attr', 'type', 'email');
      cy.get('#password').should('have.attr', 'type', 'password');
      cy.get('#confirmPassword').should('have.attr', 'type', 'password');
    });
  });
});
