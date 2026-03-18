describe('Simple Integration Test', () => {
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
        {
          id: '2',
          name: 'Test Product 2',
          description: 'Another test',
          price: 149.99,
          stock: 5,
          category: 'Clothing',
          images: ['https://via.placeholder.com/300'],
        },
      ],
    }).as('getProducts');
  });

  it('should load homepage and fetch products', () => {
    cy.visit('/');
    cy.wait('@getProducts');

    cy.contains('Descubre Productos Increíbles').should('be.visible');
    cy.get('ul li').should('have.length.greaterThan', 0);
    cy.contains('Test Product 1').should('be.visible');
  });

  it('should navigate to product detail', () => {
    cy.intercept('GET', '**/products/1', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Test Product 1',
        description: 'Test description',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        images: ['https://via.placeholder.com/300'],
      },
    }).as('getProduct');

    cy.visit('/');
    cy.wait('@getProducts');

    cy.get('ul li').first().click();
    cy.wait('@getProduct');

    cy.url().should('include', '/product/1');
    cy.contains('Test Product 1').should('be.visible');
  });
});
