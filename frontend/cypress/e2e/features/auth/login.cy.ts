describe('Auth - Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('allows a regular user to log in and persist session', () => {
    cy.get('#email').type('user@example.com');
    cy.get('#password').type('password');
    // Click the submit button explicitly to avoid matching the heading with the same text
    cy.get('button[type="submit"]').contains('Iniciar Sesión').click();

    // wait for simulated login timeout
    cy.location('pathname', { timeout: 5000 }).should('eq', '/');

    cy.window().then(win => {
      const root = JSON.parse(win.localStorage.getItem('persist:root') || '{}');
      const auth = JSON.parse(root.auth || '{}');
      expect(auth.isLoggedIn).to.equal(true);
      expect(auth.user?.role).to.equal('user');
    });
  });

  it('allows admin login and redirects to admin', () => {
    cy.get('#email').type('admin@tienda.com');
    cy.get('#password').type('admin');
    cy.get('button[type="submit"]').contains('Iniciar Sesión').click();

    cy.location('pathname', { timeout: 5000 }).should('include', '/admin');

    cy.window().then(win => {
      const root = JSON.parse(win.localStorage.getItem('persist:root') || '{}');
      const auth = JSON.parse(root.auth || '{}');
      expect(auth.isLoggedIn).to.equal(true);
      expect(auth.user?.role).to.equal('admin');
    });
  });
});
