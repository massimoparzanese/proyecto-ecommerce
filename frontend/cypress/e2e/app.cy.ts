describe('App E2E Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.get('body').should('exist');
  });

  it('should display the main heading', () => {
    cy.get('h1').should('exist');
  });

  it('should have Vite and React working', () => {
    // Assert the app's current hero heading and description
    cy.get('h1').contains('Descubre Productos Increíbles');
    cy.get('p').contains('Explora nuestra selección curada');
  });
});
