describe('ProductList Component', () => {
  beforeEach(() => {
    cy.fixture('products').then(data => {
      cy.intercept('GET', '**/products', { body: data.products }).as(
        'getProducts'
      );
      cy.intercept('GET', '**/products/*', req => {
        const id = req.url.split('/').pop();
        const product = data.products.find((p: any) => p.id === id);
        req.reply({ body: product || null });
      }).as('getProduct');
    });
    cy.visit('/');
    cy.wait('@getProducts');
  });

  describe('Product List Display', () => {
    it('should display all products', () => {
      cy.fixture('products').then(data => {
        data.products.forEach((product: any) => {
          cy.contains(product.name).should('be.visible');
        });
      });
    });

    it('should display product cards in grid layout', () => {
      cy.get('ul[class*="grid"]').should('be.visible');
      cy.get('li').should('have.length.greaterThan', 0);
    });

    it('should display pagination with correct columns for different screen sizes', () => {
      cy.get('ul[class*="grid-cols"]').should('exist');
    });

    it('should show product information correctly', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.get('img').should('be.visible');
          cy.get('h3').should('be.visible');
          cy.get('p').should('be.visible');
        });
    });
  });

  describe('Search Functionality', () => {
    it('should filter products by name', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('Laptop');
      cy.contains('Laptop Pro 15"').should('be.visible');
      cy.contains('Mouse Inalámbrico').should('not.exist');
    });

    it('should filter products by description', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('micrófono');
      cy.contains('Webcam HD 1080p').should('be.visible');
    });

    it('should show no results when search has no matches', () => {
      cy.get('input[placeholder="Buscar productos..."]').type(
        'ProductoInexistente'
      );
      cy.contains(
        'No se encontraron productos que coincidan con tu búsqueda'
      ).should('be.visible');
    });

    it('should clear search results and show all products', () => {
      const searchInput = cy.get('input[placeholder="Buscar productos..."]');
      searchInput.type('Laptop');
      cy.contains('Laptop Pro 15"').should('be.visible');

      searchInput.clear();
      cy.fixture('products').then(data => {
        cy.contains(data.products[1].name).should('be.visible');
      });
    });

    it('should be case insensitive', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('MOUSE');
      cy.contains('Mouse Inalámbrico').should('be.visible');
    });
  });

  describe('Product Stock Indicators', () => {
    it('should show low stock warning for products with less than 10 items', () => {
      cy.contains('¡Pocas unidades!').should('be.visible');
    });

    it('should display stock count on each product card', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.contains(/Stock:/i).should('be.visible');
        });
    });
  });

  describe('Product Navigation', () => {
    it('should navigate to product detail when product is clicked', () => {
      cy.get('li').first().click();
      cy.wait('@getProduct');
      cy.url().should('include', '/product/');
    });

    it('should pass product data when navigating', () => {
      cy.fixture('products').then(data => {
        cy.contains(data.products[0].name).click();
        cy.wait('@getProduct');
        cy.url().should('include', `/product/${data.products[0].id}`);
      });
    });
  });

  describe('Empty State', () => {
    it('should show no results message when list is empty', () => {
      cy.intercept('GET', '**/products', { body: [] }).as('emptyProducts');
      cy.visit('/');
      cy.wait('@emptyProducts');
      cy.contains(
        'No se encontraron productos que coincidan con tu búsqueda'
      ).should('be.visible');
    });
  });
});
