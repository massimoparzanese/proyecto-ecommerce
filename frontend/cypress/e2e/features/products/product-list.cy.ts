describe('ProductList Component', () => {
  beforeEach(() => {
    cy.mockCommonAPIs();

    cy.visit('/');
    cy.wait('@getProducts');
  });

  describe('Product List Display', () => {
    it('should display products from backend', () => {
      // Verify at least one product is displayed with the expected structure
      cy.get('ul li')
        .first()
        .within(() => {
          cy.get('h3').should('be.visible');
          cy.get('img').should('be.visible');
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
      // Get first product name and search for it
      cy.get('ul li')
        .first()
        .find('h3')
        .invoke('text')
        .then(productName => {
          const searchTerm = productName.substring(0, 5);
          cy.get('input[placeholder="Buscar productos..."]')
            .clear()
            .type(searchTerm);
          cy.contains(productName).should('be.visible');
        });
    });

    it('should filter products by searching', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('Samsung');
      cy.contains('Samsung Galaxy Buds').should('be.visible');
      cy.contains('Monitor LG').should('not.exist');
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
      searchInput.type('Samsung');
      cy.wait(500); // Wait for debounce

      searchInput.clear();
      cy.get('ul li').should('have.length.greaterThan', 0);
    });

    it('should be case insensitive', () => {
      // Get first product and search in uppercase
      cy.get('ul li')
        .first()
        .find('h3')
        .invoke('text')
        .then(productName => {
          const searchTerm = productName.substring(0, 5).toUpperCase();
          cy.get('input[placeholder="Buscar productos..."]')
            .clear()
            .type(searchTerm);
          cy.contains(productName).should('be.visible');
        });
    });
  });

  describe('Product Stock Indicators', () => {
    it('should display stock information on products', () => {
      // Check if stock indicators exist (may or may not have low stock warning)
      cy.get('ul li').should('have.length.greaterThan', 0);
      cy.get('li')
        .first()
        .within(() => {
          cy.contains(/Stock:/i).should('be.visible');
        });
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
      // mockCommonAPIs ya incluye los mocks de productos individuales
      cy.get('li').first().click();
      cy.url().should('include', '/product/');
    });

    it('should pass product data when navigating', () => {
      // Get first product and verify navigation
      cy.get('ul li')
        .first()
        .find('h3')
        .invoke('text')
        .then(productName => {
          cy.get('ul li').first().click();
          cy.url({ timeout: 10000 }).should('include', '/product/');
          cy.contains(productName, { timeout: 10000 }).should('be.visible');
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
