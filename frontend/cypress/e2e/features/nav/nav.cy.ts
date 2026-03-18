describe('Navbar', () => {
  context('Basic functionality', () => {
    beforeEach(() => {
      // Mock common APIs including unauthenticated auth/me
      cy.mockCommonAPIs('unauthenticated');
      cy.visit('/');
      cy.wait('@authMe');
    });

    it('has logo and user menu that opens on click', () => {
      cy.get('nav').should('exist');
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
      });
      cy.get('div.absolute.right-0.z-50').first().should('exist');
    });

    it('logo redirects to home for non-authenticated users', () => {
      cy.get('nav a').first().should('have.attr', 'href', '/');
    });
  });

  context('When user is not logged in', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('unauthenticated');
      cy.visit('/');
      cy.wait('@authMe');

      cy.window().then(win => {
        win.localStorage.removeItem('persist:root');
      });
      cy.reload();
    });

    it('shows login and register options in user menu', () => {
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
      });

      cy.get('div.absolute.right-0.z-50').within(() => {
        cy.contains('Iniciar Sesión').should('exist');
        cy.contains('Registrarse').should('exist');
        cy.contains('Cerrar Sesión').should('not.exist');
        cy.contains('Panel de Control').should('not.exist');
      });
    });

    it('navigates to login page from user menu', () => {
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
      });
      cy.contains('Iniciar Sesión').click();
      cy.location('pathname').should('include', '/login');
    });

    it('navigates to register page from user menu', () => {
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
      });
      cy.contains('Registrarse').click();
      cy.location('pathname').should('include', '/register');
    });
  });

  context('When user is logged in (regular user)', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('authenticated-user');
      cy.loginProgrammatic('user@test.com', 'user');
      cy.visit('/');
      cy.wait('@authMe');
    });

    it('shows logout option but no admin options', () => {
      cy.get('nav button[aria-haspopup="menu"]').click();

      cy.get('div.absolute.right-0.z-50').within(() => {
        cy.contains('Cerrar Sesión').should('be.visible');
        cy.contains('Panel de Control').should('not.exist');
        cy.contains('Gestionar Productos').should('not.exist');
        cy.contains('ADMINISTRACIÓN').should('not.exist');
      });
    });

    it('logo redirects to home for regular users', () => {
      cy.get('nav a').first().should('have.attr', 'href', '/');
    });
  });

  context('When user is logged in (admin)', () => {
    beforeEach(() => {
      cy.mockCommonAPIs('authenticated-admin');
      cy.loginProgrammatic('admin@test.com', 'admin');
      cy.visit('/');
      cy.wait('@authMe');
      // Wait for any redirects to complete and page to be ready
      cy.get('nav', { timeout: 10000 }).should('be.visible');
    });

    it('shows admin menu items with proper structure', () => {
      cy.get('nav button[aria-haspopup="menu"]').should('be.visible').click();

      cy.get('div.absolute.right-0.z-50', { timeout: 5000 }).within(() => {
        // Should show admin section header (DOM has 'Administración', CSS makes it uppercase)
        cy.contains('Administración').should('be.visible');

        // Should show admin menu items
        cy.contains('Panel de Control').should('be.visible');
        cy.contains('Gestionar Productos').should('be.visible');

        // Should show separator
        cy.get('.border-t').should('exist');

        // Should show logout
        cy.contains('Cerrar Sesión').should('be.visible');
      });
    });

    it('admin menu items have icons', () => {
      cy.get('nav button[aria-haspopup="menu"]').click();

      cy.get('div.absolute.right-0.z-50').within(() => {
        // Check for icons (svg elements) near menu items
        cy.contains('Panel de Control').parent().find('svg').should('exist');
        cy.contains('Gestionar Productos').parent().find('svg').should('exist');
      });
    });

    it('logo redirects to admin dashboard for admin users', () => {
      cy.get('nav a').first().should('have.attr', 'href', '/admin');
    });

    it('navigates to admin dashboard from menu', () => {
      cy.get('nav button[aria-haspopup="menu"]').click();
      cy.contains('Panel de Control').click();
      cy.location('pathname').should('include', '/admin');
    });

    it('navigates to product management from menu', () => {
      cy.get('nav button[aria-haspopup="menu"]').click();
      cy.contains('Gestionar Productos').click();
      cy.location('pathname').should('include', '/admin/product');
    });
  });

  context('Logout functionality', () => {
    beforeEach(() => {
      // Mock auth/me for authenticated user
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: 'user123',
            name: 'Test User',
            role: 'user',
          },
        },
      }).as('authMe');

      cy.intercept('POST', '**/auth/logout', {
        statusCode: 200,
        body: { message: 'Logged out', data: null },
      }).as('logoutAPI');

      cy.window().then(win => {
        win.localStorage.clear();

        const authState = {
          user: { id: 'user123', name: 'Test User', role: 'user' },
          token: null,
          isLoggedIn: true,
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify({ auth: JSON.stringify(authState) })
        );
      });

      cy.visit('/');
    });

    it('performs complete logout flow', () => {
      cy.get('nav button[aria-haspopup="menu"]').click();

      cy.get('div.absolute.right-0.z-50').within(() => {
        cy.contains('Cerrar Sesión').should('be.visible').click();
      });

      cy.wait('@logoutAPI');
      cy.contains('Sesión cerrada').should('be.visible');

      // Verify user is logged out
      cy.get('nav button[aria-haspopup="menu"]').click();
      cy.get('div.absolute.right-0.z-50').within(() => {
        cy.contains('Iniciar Sesión').should('be.visible');
        cy.contains('Registrarse').should('be.visible');
        cy.contains('Cerrar Sesión').should('not.exist');
      });
    });

    it('redirects to home after logout', () => {
      cy.get('nav button[aria-haspopup="menu"]').click();
      cy.contains('Cerrar Sesión').click();

      cy.wait('@logoutAPI');
      cy.location('pathname').should('eq', '/');
    });

    it('clears Redux state after logout', () => {
      cy.get('nav button[aria-haspopup="menu"]').click();
      cy.contains('Cerrar Sesión').click();

      cy.wait('@logoutAPI');

      // Check that Redux state is cleared
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
});
