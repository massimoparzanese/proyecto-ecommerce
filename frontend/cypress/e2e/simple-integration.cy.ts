describe('Simple Integration Test - Real API', () => {
  it('should load homepage and fetch real products from backend', () => {
    cy.visit('/');
    cy.contains('Descubre Productos Increíbles', { timeout: 10000 }).should(
      'be.visible'
    );
    // Wait for products to load from real API
    cy.get('ul li', { timeout: 15000 }).should('have.length.greaterThan', 0);
    cy.get('img[alt]').should('exist');
  });

  it('should navigate to product detail with real API', () => {
    cy.visit('/');
    cy.get('ul li', { timeout: 15000 }).first().click();
    cy.url({ timeout: 10000 }).should('include', '/product/');
    cy.get('h1').should('be.visible');
  });
});
