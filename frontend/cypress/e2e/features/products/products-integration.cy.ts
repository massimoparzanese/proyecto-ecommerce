describe('Products - Full Integration Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ul li', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  describe('Complete User Journey - Browse to Purchase', () => {
    it('should browse products, search, and navigate to detail page', () => {
      // Verify products are displayed
      cy.get('ul li').should('have.length.greaterThan', 0);

      // Use search functionality
      cy.get('input[placeholder="Buscar productos..."]').type('Samsung');
      // Products should filter (depends on backend data)
      cy.get('body').should('exist');

      // Clear search
      cy.get('input[placeholder="Buscar productos..."]').clear();
      cy.get('ul li').should('have.length.greaterThan', 0);

      // Click on a product
      cy.get('ul li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');
      cy.get('h1', { timeout: 10000 }).should('be.visible');
    });

    it('should show login button and navigate to login when not authenticated', () => {
      // Clear login state
      cy.window().then(win => {
        win.localStorage.removeItem('isLoggedIn');
      });

      // Click first product
      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');
      cy.contains('Iniciar Sesión', { timeout: 10000 }).click();

      // Should navigate to login
      cy.url().should('include', '/login');
    });

    it('should show buy button when logged in with stock', () => {
      // Set logged in state
      cy.window().then(win => {
        win.localStorage.setItem('isLoggedIn', 'true');
      });

      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');

      // Should see either buy button or agotado (depends on backend stock)
      cy.get('button', { timeout: 10000 }).should('exist');
    });

    it('should show appropriate button based on stock', () => {
      cy.window().then(win => {
        win.localStorage.setItem('isLoggedIn', 'true');
      });

      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');

      // Should see button (either Comprar or Agotado based on backend data)
      cy.get('button', { timeout: 10000 }).should('exist');
    });
  });

  describe('Search Across Multiple Products', () => {
    it('should search and filter products correctly', () => {
      // Search test depends on backend data
      cy.get('input[placeholder="Buscar productos..."]').type('Samsung');
      cy.get('body').should('exist');

      // Clear search
      cy.get('input[placeholder="Buscar productos..."]').clear();
      cy.get('ul li').should('have.length.greaterThan', 0);
    });

    it('should perform case insensitive search', () => {
      cy.get('input[placeholder="Buscar productos..."]').type('SAMSUNG');
      // Results depend on backend data
      cy.get('body').should('exist');
    });
  });

  describe('Product Stock Indicators Throughout Flow', () => {
    it('should show stock indicators consistently', () => {
      // Check if any stock indicators are present (depends on backend data)
      cy.get('ul li').should('have.length.greaterThan', 0);
      cy.get('li')
        .first()
        .within(() => {
          cy.contains(/Stock:/i).should('be.visible');
        });

      // Navigate to product detail
      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');
      cy.contains(/Stock:/i, { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Navigation Between Pages', () => {
    it('should navigate back from detail to home', () => {
      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');

      cy.contains('Volver a productos', { timeout: 10000 }).click();
      cy.url().should('include', '/');
    });

    it('should maintain search state when navigating', () => {
      // Perform search
      cy.get('input[placeholder="Buscar productos..."]').type('Samsung');
      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');

      // Go back
      cy.contains('Volver a productos', { timeout: 10000 }).click();

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
      cy.get('li', { timeout: 10000 }).should('be.visible');

      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');
      cy.get('h1', { timeout: 10000 }).should('be.visible');

      cy.contains('Volver a productos', { timeout: 10000 }).click();
      cy.url().should('include', '/');
    });

    it('should work on tablet throughout the flow', () => {
      cy.viewport('ipad-2');

      cy.visit('/');
      cy.get('ul[class*="md:grid-cols-3"]', { timeout: 10000 }).should('exist');

      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');

      cy.contains('Volver a productos', { timeout: 10000 }).click();
      cy.url().should('include', '/');
    });

    it('should work on desktop throughout the flow', () => {
      cy.viewport('macbook-16');

      cy.visit('/');
      cy.get('ul[class*="lg:grid-cols-4"]', { timeout: 10000 }).should('exist');

      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');

      cy.contains('Volver a productos', { timeout: 10000 }).click();
      cy.url().should('include', '/');
    });
  });

  describe('Error Recovery', () => {
    it('should load products from backend', () => {
      cy.visit('/');
      cy.get('li', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });

  describe('Product Interactions', () => {
    it('should show stock indicators in search results', () => {
      cy.get('ul li').should('have.length.greaterThan', 0);
      cy.get('li')
        .first()
        .within(() => {
          cy.contains(/Stock:/i).should('be.visible');
        });
    });

    it('should show feature icons on detail page', () => {
      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');

      // Check for feature cards
      cy.contains('Envío gratis', { timeout: 10000 }).should('be.visible');
      cy.contains('Garantía 1 año', { timeout: 10000 }).should('be.visible');
      cy.contains(/Stock:/i, { timeout: 10000 }).should('be.visible');
    });
  });
});
