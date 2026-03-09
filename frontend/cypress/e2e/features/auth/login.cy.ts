describe('Auth - Login', () => {
  // NO usar beforeEach global - cada test configura sus propios mocks
  // para evitar que se pisen los intercepts

  describe('Page Rendering', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('unauthenticated');
      cy.visit('/login');
    });

    it('should display login form with all fields', () => {
      cy.contains('Iniciar Sesión').should('be.visible');
      cy.get('#email').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show links to register and home', () => {
      cy.contains('a', 'Regístrate aquí').should(
        'have.attr',
        'href',
        '/register'
      );
      cy.contains('a', 'Volver al inicio').should('have.attr', 'href', '/');
    });

    it('should have email and password icons', () => {
      // Icons should be present (lucide-react icons)
      cy.get('svg').should('have.length.greaterThan', 0);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('unauthenticated');
      cy.visit('/login');
    });

    it('should require email field', () => {
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('#email:invalid').should('exist');
    });

    it('should require valid email format', () => {
      cy.get('#email').type('invalid-email');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('#email:invalid').should('exist');
    });

    it('should require password field', () => {
      cy.get('#email').type('user@example.com');
      cy.get('button[type="submit"]').click();

      cy.get('#password:invalid').should('exist');
    });
  });

  describe('Successful Login', () => {
    it('allows a regular user to log in successfully', () => {
      const userData = {
        id: 'user123',
        name: 'John Doe',
        email: 'user@example.com',
        role: 'user',
      };

      // Mock auth/me for initial visit (unauthenticated)
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      // Mock products/categories for post-login navigation
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      // Mock login endpoint
      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Usuario autenticado',
          data: userData,
        },
      }).as('loginAPI');

      cy.visit('/login');
      cy.wait('@authMe'); // Initial check

      // After login success, mock auth/me as authenticated
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: userData,
        },
      }).as('authMeAuthenticated');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');

      cy.get('button[type="submit"]').contains('Iniciar Sesión').click();

      cy.wait('@loginAPI');

      // Should show success toast
      cy.contains('¡Inicio de sesión exitoso!').should('be.visible');

      // Should redirect to home
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');

      // Should be logged in (check nav menu)
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
      });
      cy.get('div.absolute.right-0.z-50').within(() => {
        cy.contains('Cerrar Sesión').should('be.visible');
      });
    });

    it('allows admin login and redirects to admin dashboard', () => {
      const adminData = {
        id: 'admin123',
        name: 'Admin User',
        email: 'admin@tienda.com',
        role: 'admin',
      };

      // Mock auth/me for initial visit (unauthenticated)
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      // Mock products/categories
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Usuario autenticado',
          data: adminData,
        },
      }).as('loginAPI');

      cy.visit('/login');
      cy.wait('@authMe'); // Initial check

      // After login success, mock auth/me as authenticated admin
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: adminData,
        },
      }).as('authMeAuthenticated');

      cy.get('#email').type('admin@tienda.com');
      cy.get('#password').type('admin');

      cy.get('button[type="submit"]').contains('Iniciar Sesión').click();

      cy.wait('@loginAPI');

      // Should redirect to admin dashboard
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });

    it('should store user data in Redux persist', () => {
      const userData = {
        id: 'user456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'user',
      };

      // Mock auth/me for initial visit (unauthenticated)
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      // Mock products/categories
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Usuario autenticado',
          data: userData,
        },
      }).as('loginAPI');

      cy.visit('/login');
      cy.wait('@authMe'); // Initial check

      // After login success, mock auth/me as authenticated
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: userData,
        },
      }).as('authMeAuthenticated');

      cy.get('#email').type('jane@example.com');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI');

      // Wait for redirect and auth verification
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');

      // Check localStorage for persisted Redux state
      cy.window().then(win => {
        const persistedState = win.localStorage.getItem('persist:root');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(persistedState).to.exist;

        const parsed = JSON.parse(persistedState!);
        const auth = JSON.parse(parsed.auth);

        expect(auth.user).to.deep.include({
          id: 'user456',
          name: 'Jane Doe',
          role: 'user',
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(auth.isLoggedIn).to.be.true;
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('unauthenticated');
      cy.visit('/login');
    });

    it('should show error for invalid credentials', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: {
          message: 'Credenciales inválidas',
        },
      }).as('loginError');

      cy.get('#email').type('wrong@example.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginError');

      // Should show error toast
      cy.contains('Credenciales inválidas').should('be.visible');

      // Should stay on login page
      cy.location('pathname').should('eq', '/login');
    });

    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '**/auth/login', {
        forceNetworkError: true,
      }).as('networkError');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      // Should show network error message
      cy.contains(/error.*red/i).should('be.visible');
    });

    it('should handle missing response data', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Success',
          data: {}, // Missing id and role
        },
      }).as('incompleteResponse');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      cy.wait('@incompleteResponse');

      // Should show error about incomplete response
      cy.contains(/respuesta.*incompleta/i).should('be.visible');
    });

    it('should handle server errors (500)', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 500,
        body: {
          message: 'Error interno del servidor',
        },
      }).as('serverError');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      cy.wait('@serverError');

      cy.contains(/error/i).should('be.visible');
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('unauthenticated');
    });

    it('should show loading state during login request', () => {
      cy.intercept('POST', '**/auth/login', req => {
        req.reply({
          delay: 1000,
          statusCode: 201,
          body: {
            message: 'Success',
            data: {
              id: '1',
              name: 'User',
              email: 'user@test.com',
              role: 'user',
            },
          },
        });
      }).as('slowLogin');

      cy.visit('/login');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      // Should show loading text
      cy.contains('button', 'Iniciando sesión...').should('be.visible');

      // Button should be disabled
      cy.get('button[type="submit"]').should('be.disabled');

      cy.wait('@slowLogin');

      // Should return to normal state if error occurs or redirect if success
    });

    it('should prevent double submission', () => {
      cy.intercept('POST', '**/auth/login', req => {
        req.reply({
          delay: 1500,
          statusCode: 201,
          body: {
            message: 'Success',
            data: {
              id: '1',
              name: 'User',
              email: 'user@test.com',
              role: 'user',
            },
          },
        });
      }).as('slowLogin');

      cy.visit('/login');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');

      // Click submit twice
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click({ force: true });

      // Should only make one request
      cy.wait('@slowLogin');
      cy.get('@slowLogin.all').should('have.length', 1);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('unauthenticated');
      cy.visit('/login');
    });

    it('should navigate to register page', () => {
      cy.contains('a', 'Regístrate aquí').click();
      cy.location('pathname').should('eq', '/register');
    });

    it('should navigate to home page', () => {
      cy.contains('a', 'Volver al inicio').click();
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Redirect After Login', () => {
    it('redirects to previous page after successful login (intended destination)', () => {
      // Clear any existing auth
      cy.window().then(win => {
        win.localStorage.clear();
      });

      const adminData = {
        id: 'admin123',
        name: 'Admin User',
        email: 'admin@tienda.com',
        role: 'admin',
      };

      // Mock auth/me for unauthenticated (visit /admin, visit /login)
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      // Mock products and categories
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica', 'Ropa'],
      }).as('getCategories');

      // Try to access a protected route (e.g., /admin)
      cy.visit('/admin');
      cy.wait('@authMe');

      // Should redirect to login with state
      cy.location('pathname').should('eq', '/login');

      // Now mock authenticated for post-login
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: adminData,
        },
      }).as('authMeAuthenticated');

      // Now perform login
      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Usuario autenticado',
          data: adminData,
        },
      }).as('loginAPI');

      cy.get('#email').type('admin@tienda.com');
      cy.get('#password').type('admin');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI');

      // Should redirect back to /admin (the intended destination)
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });

    it('redirects to home if no previous page (direct login)', () => {
      const userData = {
        id: 'user123',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
      };

      // Mock auth/me for initial visit (unauthenticated)
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      // Mock products/categories
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Usuario autenticado',
          data: userData,
        },
      }).as('loginAPI');

      // Direct visit to login page (no previous page)
      cy.visit('/login');
      cy.wait('@authMe'); // Initial check

      // After login success, mock auth/me as authenticated
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: userData,
        },
      }).as('authMeAuthenticated');

      cy.get('#email').type('user@example.com');
      cy.get('#password').type('password');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI');

      // Should redirect to home (no previous page)
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');
    });

    it('admin redirects to admin dashboard if no previous page', () => {
      const adminData = {
        id: 'admin123',
        name: 'Admin User',
        email: 'admin@tienda.com',
        role: 'admin',
      };

      // Mock auth/me for initial visit (unauthenticated)
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      // Mock products/categories
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Usuario autenticado',
          data: adminData,
        },
      }).as('loginAPI');

      cy.visit('/login');
      cy.wait('@authMe'); // Initial check

      // After login success, mock auth/me as authenticated admin
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: adminData,
        },
      }).as('authMeAuthenticated');

      cy.get('#email').type('admin@tienda.com');
      cy.get('#password').type('admin');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI');

      // Admin should go to /admin by default
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('unauthenticated');
      cy.visit('/login');
    });

    it('should have proper labels for inputs', () => {
      cy.get('label[for="email"]').should('contain', 'Email');
      cy.get('label[for="password"]').should('contain', 'Contraseña');
    });

    it('should mark inputs as required', () => {
      cy.get('#email').should('have.attr', 'required');
      cy.get('#password').should('have.attr', 'required');
    });

    it('should have proper input types', () => {
      cy.get('#email').should('have.attr', 'type', 'email');
      cy.get('#password').should('have.attr', 'type', 'password');
    });
  });
});
