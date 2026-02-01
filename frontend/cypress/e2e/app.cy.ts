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
    cy.contains('Vite').should('exist');
    cy.contains('React').should('exist');
  });
});
