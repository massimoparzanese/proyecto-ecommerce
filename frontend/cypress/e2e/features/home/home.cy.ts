describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows hero heading and description', () => {
    cy.get('h1').contains('Descubre Productos Increíbles');
    cy.get('p').contains('Explora nuestra selección curada');
  });
});
