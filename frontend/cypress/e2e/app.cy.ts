describe('App E2E Test', () => {
  beforeEach(() => {
    // Mock products API for basic tests
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Test Product',
          description: 'Description',
          price: 99.99,
          stock: 10,
          category: 'Electronics',
          images: ['https://via.placeholder.com/300'],
        },
      ],
    }).as('getProducts');

    cy.visit('/');
    cy.wait('@getProducts');
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
