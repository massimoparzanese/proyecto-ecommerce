describe('Auth - Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('registers a new user and redirects to home', () => {
    cy.get('#name').type('Test User');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    // Ensure we click the form submit button (heading uses same text)
    cy.get('button[type="submit"]').contains('Crear Cuenta').click();

    cy.location('pathname', { timeout: 5000 }).should('eq', '/');

    cy.window().then(win => {
      const root = JSON.parse(win.localStorage.getItem('persist:root') || '{}');
      const auth = JSON.parse(root.auth || '{}');
      expect(auth.isLoggedIn).to.equal(true);
      expect(auth.user?.role).to.equal('user');
    });
  });
});
