describe('Home Page - Products Integration', () => {
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
  });

  describe('Page Load and Hero Section', () => {
    it('should load the homepage successfully', () => {
      cy.visit('/');
      cy.url().should('include', '/');
    });

    it('should display hero heading', () => {
      cy.visit('/');
      cy.get('h1')
        .contains('Descubre Productos Increíbles')
        .should('be.visible');
    });

    it('should display hero description', () => {
      cy.visit('/');
      cy.contains('Explora nuestra selección curada').should('be.visible');
    });

    it('should have gradient background styling', () => {
      cy.visit('/');
      cy.get('[class*="bg-gradient"]').should('exist');
    });
  });

  describe('Product Loading States', () => {
    it('should show loading skeleton while fetching products', () => {
      cy.intercept('GET', '**/products', {
        delay: 2000,
        body: [],
      }).as('slowProducts');

      cy.visit('/');

      cy.get('[class*="animate-pulse"]').should('be.visible');
    });

    it('should display products after loading', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      cy.fixture('products').then(data => {
        cy.contains(data.products[0].name).should('be.visible');
      });
    });
  });

  describe('Search Bar', () => {
    it('should display search input', () => {
      cy.visit('/');
      cy.get('input[placeholder="Buscar productos..."]').should('be.visible');
    });

    it('should have centered search bar', () => {
      cy.visit('/');
      cy.get('input[placeholder="Buscar productos..."]')
        .parent()
        .should('have.class', 'flex')
        .and('have.class', 'justify-center');
    });

    it('should allow typing in search bar', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('input[placeholder="Buscar productos..."]')
        .type('Laptop')
        .should('have.value', 'Laptop');
    });
  });

  describe('Error Handling', () => {
    it('should show error message when API fails', () => {
      cy.intercept('GET', '**/products', {
        statusCode: 500,
        body: { message: 'Server error' },
      }).as('failedProducts');

      cy.visit('/');
      cy.wait('@failedProducts');
      cy.contains(/Error:/i).should('be.visible');
    });

    it('should show no results for failed API calls', () => {
      cy.intercept('GET', '**/products', {
        statusCode: 500,
      }).as('failedProducts');

      cy.visit('/');
      cy.wait('@failedProducts');
      cy.contains(/Error:/i).should('be.visible');
    });
  });

  describe('Product Filtering and Search Integration', () => {
    it('should filter products by search term', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('input[placeholder="Buscar productos..."]').type('Laptop');
      cy.contains('Laptop Pro 15"').should('be.visible');
    });

    it('should show products matching category', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('input[placeholder="Buscar productos..."]').type('Electrónica');
      cy.fixture('products').then(data => {
        const electronicProducts = data.products.filter((p: any) =>
          p.category.toLowerCase().includes('electrónica')
        );
        cy.get('ul li').should('have.length', electronicProducts.length);
      });
    });

    it('should display no results message when search has no matches', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('input[placeholder="Buscar productos..."]').type(
        'NonExistentProduct123'
      );
      cy.contains(
        'No se encontraron productos que coincidan con tu búsqueda'
      ).should('be.visible');
    });
  });

  describe('Product Grid Display on Home', () => {
    it('should display products in responsive grid', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('ul[class*="grid"]').should('have.class', 'grid-cols-2');
      cy.get('ul[class*="grid"]').should('have.class', 'md:grid-cols-3');
      cy.get('ul[class*="grid"]').should('have.class', 'lg:grid-cols-4');
    });

    it('should display correct number of products', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.fixture('products').then(data => {
        cy.get('ul li').should('have.length', data.products.length);
      });
    });

    it('should have proper spacing between products', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('ul[class*="grid"]').should('have.class', 'gap-6');
    });
  });

  describe('Navigation Integration', () => {
    it('should navigate to product detail on product click', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.fixture('products').then(data => {
        cy.contains(data.products[0].name).click();
        cy.wait('@getProduct');
        cy.url().should('include', `/product/${data.products[0].id}`);
      });
    });

    it('should preserve product data when navigating to detail', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('li').first().click();
      cy.wait('@getProduct');

      // Verify we're on detail page with product info
      cy.url().should('include', '/product/');
      cy.get('h1').should('be.visible');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should display properly on mobile devices', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('h1').should('be.visible');
      cy.get('input[placeholder="Buscar productos..."]').should('be.visible');
      cy.get('ul li').should('exist');
    });

    it('should display properly on tablets', () => {
      cy.viewport('ipad-2');
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('h1').should('be.visible');
      cy.get('ul[class*="md:grid-cols-3"]').should('exist');
    });

    it('should display properly on desktop', () => {
      cy.viewport('macbook-16');
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('h1').should('be.visible');
      cy.get('ul[class*="lg:grid-cols-4"]').should('exist');
    });
  });

  describe('Empty State', () => {
    it('should handle empty product list gracefully', () => {
      cy.intercept('GET', '**/products', { body: [] }).as('emptyProducts');

      cy.visit('/');
      cy.wait('@emptyProducts');

      cy.contains(
        'No se encontraron productos que coincidan con tu búsqueda'
      ).should('be.visible');
    });
  });

  describe('Product Stock Display', () => {
    it('should show low stock warning badge', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.contains('¡Pocas unidades!').should('be.visible');
    });

    it('should display stock count on each product', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('li')
        .first()
        .within(() => {
          cy.contains(/Stock:/i).should('be.visible');
        });
    });
  });
});
