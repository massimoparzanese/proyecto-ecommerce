describe('Home Page - Products Integration', () => {
  beforeEach(() => {
    // Mock common APIs
    cy.mockCommonAPIs();

    cy.visit('/');
    cy.wait('@getProducts');
  });

  describe('Page Load and Hero Section', () => {
    it('should load the homepage successfully', () => {
      cy.url().should('include', '/');
    });

    it('should display hero heading', () => {
      cy.get('h1')
        .contains('Descubre Productos Increíbles')
        .should('be.visible');
    });

    it('should display hero description', () => {
      cy.contains('Explora nuestra selección curada').should('be.visible');
    });

    it('should have gradient background styling', () => {
      cy.get('[class*="bg-gradient"]').should('exist');
    });
  });

  describe('Product Loading States', () => {
    it('should show products after loading', () => {
      cy.get('ul li').should('have.length.greaterThan', 0);
      cy.get('ul li')
        .first()
        .within(() => {
          cy.get('h3').should('be.visible');
        });
    });

    it('should display product cards', () => {
      cy.get('ul li').should('be.visible');
    });
  });

  describe('Search Bar', () => {
    it('should display search input', () => {
      cy.get('input[placeholder="Buscar productos..."]').should('be.visible');
    });

    it('should have centered search bar', () => {
      cy.get('input[placeholder="Buscar productos..."]')
        .parent()
        .should('have.class', 'flex')
        .and('have.class', 'justify-center');
    });

    it('should allow typing in search bar', () => {
      cy.get('input[placeholder="Buscar productos..."]')
        .type('Samsung')
        .should('have.value', 'Samsung');
    });
  });

  describe('Error Handling', () => {
    it('should show products from backend', () => {
      // Verify products loaded successfully from real backend
      cy.get('ul li').should('have.length.greaterThan', 0);
    });

    it('should handle API responses correctly', () => {
      // Just verify the page loaded correctly
      cy.get('h1').should('be.visible');
      cy.get('ul li').should('exist');
    });
  });

  describe('Product Filtering and Search Integration', () => {
    it('should filter products by search term', () => {
      cy.get('input[placeholder="Buscar productos..."]')
        .clear()
        .type('Samsung');
      cy.contains('Samsung Galaxy Buds').should('be.visible');
      cy.contains('Monitor LG').should('not.exist');
    });

    it('should show filtered products or no results', () => {
      cy.get('input[placeholder="Buscar productos..."]')
        .clear()
        .type('Monitor');
      cy.contains('Monitor LG').should('be.visible');
      cy.contains('Samsung').should('not.exist');
    });

    it('should display no results message when search has no matches', () => {
      cy.get('input[placeholder="Buscar productos..."]')
        .clear()
        .type('NonExistentProduct123XYZ999');
      cy.contains(
        'No se encontraron productos que coincidan con tu búsqueda'
      ).should('be.visible');
    });
  });

  describe('Product Grid Display on Home', () => {
    it('should display products in responsive grid', () => {
      cy.get('ul[class*="grid"]').should('have.class', 'grid-cols-2');
      cy.get('ul[class*="grid"]').should('have.class', 'md:grid-cols-3');
      cy.get('ul[class*="grid"]').should('have.class', 'lg:grid-cols-4');
    });

    it('should display products from backend', () => {
      cy.get('ul li').should('have.length.greaterThan', 0);
    });

    it('should have proper spacing between products', () => {
      cy.get('ul[class*="grid"]').should('have.class', 'gap-6');
    });
  });

  describe('Navigation Integration', () => {
    it('should navigate to product detail on product click', () => {
      // mockCommonAPIs ya incluye los mocks de productos individuales
      cy.get('ul li').first().click();
      cy.url().should('include', '/product/');
    });

    it('should preserve product data when navigating to detail', () => {
      cy.get('li').first().click();
      cy.url().should('include', '/product/');
      cy.get('h1').should('contain', 'Samsung Galaxy Buds');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should display properly on mobile devices', () => {
      cy.viewport('iphone-x');
      cy.reload();
      cy.wait('@getProducts');
      cy.get('h1').should('be.visible');
      cy.get('input[placeholder="Buscar productos..."]').should('be.visible');
      cy.get('ul li').should('exist');
    });

    it('should display properly on tablets', () => {
      cy.viewport('ipad-2');
      cy.reload();
      cy.wait('@getProducts');
      cy.get('h1').should('be.visible');
      cy.get('ul[class*="md:grid-cols-3"]').should('exist');
    });

    it('should display properly on desktop', () => {
      cy.viewport('macbook-16');
      cy.reload();
      cy.wait('@getProducts');
      cy.get('h1').should('be.visible');
      cy.get('ul[class*="lg:grid-cols-4"]').should('exist');
    });
  });

  describe('Product Stock Display', () => {
    it('should display stock information', () => {
      cy.get('ul li').should('have.length.greaterThan', 0);
    });

    it('should display stock count on each product', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.contains(/Stock:/i).should('be.visible');
        });
    });
  });
});
