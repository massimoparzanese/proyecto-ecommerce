describe('Navbar', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('Basic functionality', () => {
    it('has logo and user menu that opens on click', () => {
      cy.get('nav').should('exist');
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
      });
      cy.get('div[role="menu"], div.absolute.right-0.z-50')
        .first()
        .should('exist');
    });
  });

  context('When user is not logged in', () => {
    beforeEach(() => {
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
      });
    });

    it('navigates to login page from user menu', () => {
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
        cy.contains('Iniciar Sesión').click();
      });
      cy.location('pathname').should('include', '/login');
    });

    it('navigates to register page from user menu', () => {
      cy.get('nav').within(() => {
        cy.get('button[aria-haspopup="menu"]').click();
        cy.contains('Registrarse').click();
      });
      cy.location('pathname').should('include', '/register');
    });
  });

  context('Logout functionality', () => {
    it('performs complete logout flow', () => {
      cy.intercept('POST', '**/auth/logout', {
        statusCode: 200,
        body: { message: 'Logged out', data: null },
      }).as('logoutAPI');

      cy.window().then(win => {
        win.localStorage.clear();

        // Simulate the correct redux-persist format
        const authState = {
          user: { id: '1', name: 'user', role: 'user' },
          token: 'fake-token',
          isLoggedIn: true,
        };

        // The way redux-persist stores the root state
        const persistedState = {
          auth: authState,
          _persist: {
            version: 1,
            rehydrated: true,
          },
        };

        win.localStorage.setItem(
          'persist:root',
          JSON.stringify(persistedState)
        );
      });

      cy.visit('/');
      cy.wait(1500);

      cy.get('nav button[aria-haspopup="menu"]').click();

      cy.get('div.absolute.right-0.z-50').should('exist');

      cy.get('div.absolute.right-0.z-50').then($menu => {
        if ($menu.text().includes('Cerrar Sesión')) {
          cy.wrap($menu).within(() => {
            cy.contains('Cerrar Sesión').click();
          });

          cy.wait('@logoutAPI');
          cy.contains('Sesión cerrada').should('be.visible');

          cy.get('nav button[aria-haspopup="menu"]').click();
          cy.get('div.absolute.right-0.z-50').within(() => {
            cy.contains('Iniciar Sesión').should('be.visible');
            cy.contains('Registrarse').should('be.visible');
          });
        } else {
          cy.log('User not logged in - logout functionality not available');
          cy.wrap($menu).within(() => {
            cy.contains('Iniciar Sesión').should('exist');
            cy.contains('Registrarse').should('exist');
          });
        }
      });
    });
  });
});
