describe('Navbar', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('has logo and user menu that opens on click', () => {
    cy.get('nav').should('exist');
    // avatar button opens menu
    cy.get('nav').within(() => {
      cy.get('button[aria-haspopup="menu"]').click();
    });
    cy.get('div[role="menu"], .border-border').should('exist');
  });

  it('navigates to login from user menu', () => {
    cy.get('nav').within(() => {
      cy.get('button[aria-haspopup="menu"]').click();
      cy.contains('Iniciar Sesión').click();
    });
    cy.location('pathname').should('include', '/login');
  });
});
