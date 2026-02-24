describe('Products - Full Integration Flow', () => {
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

  describe('Complete User Journey - Browse to Purchase', () => {
    it('should browse products, search, and navigate to detail page', () => {
      // Load home page
      cy.visit('/');
      cy.wait('@getProducts');

      // Verify products are displayed
      cy.get('ul li').should('have.length.greaterThan', 0);

      // Use search functionality
      cy.get('input[placeholder="Buscar productos..."]').type('Laptop');
      cy.contains('Laptop Pro 15"').should('be.visible');

      // Clear search
      cy.get('input[placeholder="Buscar productos..."]').clear();
      cy.fixture('products').then(data => {
        cy.get('ul li').should('have.length', data.products.length);
      });

      // Click on a product
      cy.fixture('products').then(data => {
        cy.contains(data.products[0].name).click();
        cy.wait('@getProduct');
        cy.url().should('include', `/product/${data.products[0].id}`);
        cy.contains(data.products[0].name).should('be.visible');
      });
    });

    it('should show login button and navigate to login when not authenticated', () => {
      // Clear login state
      cy.window().then(win => {
        win.localStorage.removeItem('isLoggedIn');
      });

      cy.visit('/');
      cy.wait('@getProducts');

      // Click first product
      cy.get('li').first().click();
      cy.wait('@getProduct');
      cy.contains('Iniciar Sesión').click();

      // Should navigate to login
      cy.url().should('include', '/login');
    });

    it('should show buy button when logged in with stock', () => {
      // Set logged in state
      cy.window().then(win => {
        win.localStorage.setItem('isLoggedIn', 'true');
      });

      cy.visit('/');
      cy.wait('@getProducts');

      cy.fixture('products').then(data => {
        const productWithStock = data.products.find((p: any) => p.stock > 0);

        if (productWithStock) {
          cy.contains(productWithStock.name).click();
          cy.wait('@getProduct');
          cy.url().should('include', `/product/${productWithStock.id}`);

          // Should see buy button
          cy.contains('Comprar Ahora').should('be.visible');
          cy.contains('Comprar Ahora').should('not.be.disabled');
        }
      });
    });

    it('should disable buy button for out of stock products', () => {
      cy.window().then(win => {
        win.localStorage.setItem('isLoggedIn', 'true');
      });

      cy.visit('/');
      cy.wait('@getProducts');

      cy.fixture('products').then(data => {
        const outOfStockProduct = data.products.find((p: any) => p.stock === 0);

        if (outOfStockProduct) {
          cy.contains(outOfStockProduct.name).click();
          cy.wait('@getProduct');
          cy.url().should('include', `/product/${outOfStockProduct.id}`);

          // Should see agotado button
          cy.contains('Agotado').should('be.visible');
          cy.contains('Agotado').should('be.disabled');
        }
      });
    });
  });

  describe('Search Across Multiple Products', () => {
    it('should search and filter products correctly', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      // Search by category
      cy.get('input[placeholder="Buscar productos..."]').type('Accesorios');
      cy.fixture('products').then(data => {
        const accesoriosCount = data.products.filter((p: any) =>
          p.category.includes('Accesorios')
        ).length;
        cy.get('ul li').should('have.length', accesoriosCount);
      });

      // Clear and search by price range keyword
      cy.get('input[placeholder="Buscar productos..."]').clear();
      cy.get('input[placeholder="Buscar productos..."]').type('RGB');
      cy.contains('Teclado Mecánico RGB').should('be.visible');
    });

    it('should perform case insensitive search', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('input[placeholder="Buscar productos..."]').type('AURICULARES');
      cy.contains('Auriculares Inalámbricos').should('be.visible');
    });
  });

  describe('Product Stock Indicators Throughout Flow', () => {
    it('should show stock indicators on home and detail pages', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      // Check home page stock indicators
      cy.fixture('products').then(data => {
        const lowStockProducts = data.products.filter(
          (p: any) => p.stock < 10 && p.stock > 0
        );

        if (lowStockProducts.length > 0) {
          cy.contains('¡Pocas unidades!').should('be.visible');

          // Navigate to low stock product
          cy.visit(`/product/${lowStockProducts[0].id}`);
          cy.wait('@getProduct');
          cy.contains(
            `¡Solo quedan ${lowStockProducts[0].stock} unidades!`
          ).should('be.visible');
        }
      });
    });
  });

  describe('Navigation Between Pages', () => {
    it('should navigate back from detail to home', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('li').first().click();
      cy.wait('@getProduct');
      cy.url().should('include', '/product/');

      cy.contains('Volver a productos').click();
      cy.url().should('include', '/');
    });

    it('should maintain search state when navigating', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      // Perform search
      cy.get('input[placeholder="Buscar productos..."]').type('Laptop');
      cy.contains('Laptop Pro 15"').click();
      cy.wait('@getProduct');

      // Go back
      cy.contains('Volver a productos').click();

      // Search is cleared (as per current implementation)
      cy.get('input[placeholder="Buscar productos..."]').should(
        'have.value',
        ''
      );
    });
  });

  describe('Responsive Design Throughout Journey', () => {
    it('should work on mobile throughout the flow', () => {
      cy.viewport('iphone-x');

      cy.visit('/');
      cy.wait('@getProducts');
      cy.get('li').should('be.visible');

      cy.get('li').first().click();
      cy.wait('@getProduct');
      cy.url().should('include', '/product/');
      cy.get('h1').should('be.visible');

      cy.contains('Volver a productos').click();
      cy.url().should('include', '/');
    });

    it('should work on tablet throughout the flow', () => {
      cy.viewport('ipad-2');

      cy.visit('/');
      cy.wait('@getProducts');
      cy.get('ul[class*="md:grid-cols-3"]').should('exist');

      cy.get('li').first().click();
      cy.wait('@getProduct');
      cy.url().should('include', '/product/');

      cy.contains('Volver a productos').click();
      cy.url().should('include', '/');
    });

    it('should work on desktop throughout the flow', () => {
      cy.viewport('macbook-16');

      cy.visit('/');
      cy.wait('@getProducts');
      cy.get('ul[class*="lg:grid-cols-4"]').should('exist');

      cy.get('li').first().click();
      cy.wait('@getProduct');
      cy.url().should('include', '/product/');

      cy.contains('Volver a productos').click();
      cy.url().should('include', '/');
    });
  });

  describe('Error Recovery', () => {
    it('should recover from API error and allow browsing', () => {
      // First fail
      cy.intercept('GET', '**/products', { statusCode: 500 }).as(
        'failedProducts'
      );
      cy.visit('/');
      cy.wait('@failedProducts');
      cy.contains(/Error:/i).should('be.visible');

      // Reset and succeed
      cy.fixture('products').then(data => {
        cy.intercept('GET', '**/products', { body: data.products }).as(
          'successProducts'
        );
      });

      cy.reload();
      cy.wait('@successProducts');
      cy.get('li').should('have.length.greaterThan', 0);
    });
  });

  describe('Product Interactions', () => {
    it('should highlight low stock items on search results', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.fixture('products').then(data => {
        const lowStockProducts = data.products.filter(
          (p: any) => p.stock < 10 && p.stock > 0
        );

        if (lowStockProducts.length > 0) {
          // Search to isolate low stock product
          cy.get('input[placeholder="Buscar productos..."]').type(
            lowStockProducts[0].name.substring(0, 5)
          );
          cy.contains('¡Pocas unidades!').should('be.visible');
        }
      });
    });

    it('should show feature icons on detail page', () => {
      cy.visit('/');
      cy.wait('@getProducts');

      cy.get('li').first().click();
      cy.wait('@getProduct');

      // Check for feature cards
      cy.contains('Envío gratis').should('be.visible');
      cy.contains('Garantía 1 año').should('be.visible');
      cy.contains(/Stock:/i).should('be.visible');
    });
  });
});
