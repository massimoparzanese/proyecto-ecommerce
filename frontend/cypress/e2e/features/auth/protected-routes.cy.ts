describe('Protected Routes', () => {
  // NO usar beforeEach global - cada test define sus propios mocks
  // para evitar que se pisen los intercepts

  context('AdminRoute - Access Control', () => {
    it('redirects to login when not authenticated', () => {
      // Mock auth/me to return unauthorized
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      cy.window().then(win => {
        win.localStorage.clear();
      });

      cy.visit('/admin');

      // Should verify auth with backend
      cy.wait('@authMe');

      // Should redirect to login
      cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
    });

    it('redirects regular user to home when accessing admin routes', () => {
      // Mock auth/me for regular user
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: 'user123',
            name: 'Regular User',
            role: 'user',
          },
        },
      }).as('authMe');

      // Mock products for home page redirect
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      cy.window().then(win => {
        const authState = {
          user: { id: 'user123', name: 'Regular User', role: 'user' },
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/admin');

      // Should verify auth with backend
      cy.wait('@authMe');

      // Should redirect to home (not admin)
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');
    });

    it('allows admin user to access admin routes', () => {
      // Mock auth/me for admin user
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: 'admin123',
            name: 'Admin User',
            role: 'admin',
          },
        },
      }).as('authMe');

      // Mock products for admin page
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      cy.window().then(win => {
        const authState = {
          user: { id: 'admin123', name: 'Admin User', role: 'admin' },
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/admin');

      // Should verify auth with backend
      cy.wait('@authMe');

      // Should stay on admin page
      cy.location('pathname', { timeout: 5000 }).should('include', '/admin');
    });

    it('shows loading state while verifying authentication', () => {
      // Slow down auth/me response to see loading
      cy.intercept('GET', '**/auth/me', req => {
        req.reply(res => {
          res.delay = 1000;
          res.send({
            statusCode: 200,
            body: {
              message: 'Usuario autenticado',
              data: {
                id: 'admin123',
                name: 'Admin User',
                role: 'admin',
              },
            },
          });
        });
      }).as('authMeSlow');

      cy.window().then(win => {
        const authState = {
          user: { id: 'admin123', name: 'Admin User', role: 'admin' },
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/admin');

      // Should show loading state
      cy.contains('Verificando permisos de administrador...').should(
        'be.visible'
      );

      cy.wait('@authMeSlow');

      // Loading should disappear after auth
      cy.contains('Verificando permisos de administrador...').should(
        'not.exist'
      );
    });

    it('handles expired/invalid token by redirecting to login', () => {
      // Mock auth/me to return invalid token
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'Token inválido', data: null },
      }).as('authMe');

      // User has data in Redux but token is invalid
      cy.window().then(win => {
        const authState = {
          user: { id: 'admin123', name: 'Admin User', role: 'admin' },
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/admin');

      cy.wait('@authMe');

      // Should redirect to login despite Redux state
      cy.location('pathname', { timeout: 5000 }).should('eq', '/login');

      // Redux should be cleared
      cy.window().then(win => {
        const persistedState = win.localStorage.getItem('persist:root');
        if (persistedState) {
          const parsed = JSON.parse(persistedState);
          const auth = JSON.parse(parsed.auth);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          expect(auth.user).to.be.null;
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          expect(auth.isLoggedIn).to.be.false;
        }
      });
    });
  });

  context('PublicOnlyRoute - Login/Register Pages', () => {
    it('allows unauthenticated users to access login page', () => {
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      cy.window().then(win => {
        win.localStorage.clear();
      });

      cy.visit('/login');

      // Should render login page
      cy.contains('Iniciar Sesión').should('be.visible');
      cy.get('#email').should('exist');
      cy.get('#password').should('exist');
    });

    it('redirects authenticated regular user from login to home', () => {
      const userData = { id: 'user123', name: 'Regular User', role: 'user' };

      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: userData,
        },
      }).as('authMe');

      cy.window().then(win => {
        const authState = {
          user: userData,
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/login');

      // Should redirect to home
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');
    });

    it('redirects authenticated admin user from login to admin dashboard', () => {
      const adminData = { id: 'admin123', name: 'Admin User', role: 'admin' };

      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: adminData,
        },
      }).as('authMe');

      cy.window().then(win => {
        const authState = {
          user: adminData,
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/login');

      // Should redirect to admin
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });

    it('redirects authenticated user from register page', () => {
      const userData = { id: 'user123', name: 'Regular User', role: 'user' };

      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: userData,
        },
      }).as('authMe');

      cy.window().then(win => {
        const authState = {
          user: userData,
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/register');

      // Should redirect to home
      cy.location('pathname', { timeout: 5000 }).should('eq', '/');
    });
  });

  context('Authentication Flow Integration', () => {
    it('preserves intended destination after login', () => {
      // Try to access admin without auth
      cy.intercept('GET', '**/auth/me', {
        statusCode: 401,
        body: { message: 'No hay sesión activa', data: null },
      }).as('authMe');

      cy.window().then(win => {
        win.localStorage.clear();
      });

      cy.visit('/admin');
      cy.wait('@authMe');

      // Should redirect to login
      cy.location('pathname').should('eq', '/login');

      // Now login as admin
      cy.intercept('POST', '**/auth/login', {
        statusCode: 201,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: 'admin123',
            name: 'Admin User',
            email: 'admin@tienda.com',
            role: 'admin',
          },
        },
      }).as('loginAPI');

      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: 'admin123',
            name: 'Admin User',
            role: 'admin',
          },
        },
      }).as('authMeAfterLogin');

      cy.get('#email').type('admin@tienda.com');
      cy.get('#password').type('admin');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI');

      // Should redirect back to admin (the original destination)
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });

    it('syncs Redux state with backend on page load', () => {
      // Mock auth/me for authenticated user
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: 'user456',
            name: 'Backend User',
            role: 'user',
          },
        },
      }).as('authMe');

      // Redux has different/stale data
      cy.window().then(win => {
        const authState = {
          user: { id: 'old-id', name: 'Old Name', role: 'user' },
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/');

      // Should call auth/me on mount
      cy.wait('@authMe');

      // Wait a bit for Redux persist to update localStorage
      cy.wait(500);

      // Redux should be updated with backend data
      cy.window().then(win => {
        const persistedState = win.localStorage.getItem('persist:root');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(persistedState).to.exist;

        const parsed = JSON.parse(persistedState!);
        const auth = JSON.parse(parsed.auth);

        // Should have backend data, not stale data
        expect(auth.user.id).to.eq('user456');
        expect(auth.user.name).to.eq('Backend User');
      });
    });
  });
});
