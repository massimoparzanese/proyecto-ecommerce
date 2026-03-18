describe('Home page', () => {
  beforeEach(() => {
    // Mock products API
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Test Product 1',
          description: 'Test description',
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

  it('shows hero heading and description', () => {
    cy.get('h1').contains('Descubre Productos Increíbles');
    cy.get('p').contains('Explora nuestra selección curada');
  });
});
