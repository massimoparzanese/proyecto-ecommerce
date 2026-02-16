describe('Auth - Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('registers a new user successfully', () => {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 201,
      body: {
        message: 'User registered',
        data: { email: 'newuser@example.com', name: 'Test User', role: 'user' },
      },
    }).as('registerAPI');

    cy.get('#name').type('Test User');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');

    cy.get('button[type="submit"]').contains('Crear Cuenta').click();

    cy.wait('@registerAPI');

    cy.location('pathname', { timeout: 5000 }).should('eq', '/');

    cy.get('nav').within(() => {
      cy.get('button[aria-haspopup="menu"]').click();
    });
    cy.get('div.absolute.right-0.z-50').within(() => {
      cy.contains('Cerrar Sesión').should('be.visible');
    });
  });
});
