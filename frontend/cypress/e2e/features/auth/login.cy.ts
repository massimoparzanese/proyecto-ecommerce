describe('Auth - Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('allows a regular user to log in successfully', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 201,
      body: {
        message: 'Usuario autenticado',
        data: { name: 'user', role: 'user' },
      },
    }).as('loginAPI');

    cy.get('#email').type('user@example.com');
    cy.get('#password').type('password');

    cy.get('button[type="submit"]').contains('Iniciar Sesión').click();

    cy.wait('@loginAPI');

    cy.location('pathname', { timeout: 5000 }).should('eq', '/');

    cy.get('nav').within(() => {
      cy.get('button[aria-haspopup="menu"]').click();
    });
    cy.get('div.absolute.right-0.z-50').within(() => {
      cy.contains('Cerrar Sesión').should('be.visible');
    });
  });

  it('allows admin login successfully', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 201,
      body: {
        message: 'Usuario autenticado',
        data: { name: 'admin', role: 'admin' },
      },
    }).as('loginAPI');

    cy.get('#email').type('admin@tienda.com');
    cy.get('#password').type('admin');

    cy.get('button[type="submit"]').contains('Iniciar Sesión').click();

    cy.wait('@loginAPI');

    cy.location('pathname', { timeout: 5000 }).should('eq', '/');

    cy.get('nav').within(() => {
      cy.get('button[aria-haspopup="menu"]').click();
    });
    cy.get('div.absolute.right-0.z-50').within(() => {
      cy.contains('Cerrar Sesión').should('be.visible');
    });
  });
});
