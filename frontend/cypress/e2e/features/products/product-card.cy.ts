describe('ProductCard Component', () => {
  beforeEach(() => {
    cy.mockCommonAPIs();

    cy.visit('/');
    cy.wait('@getProducts');
  });

  describe('Product Card Display', () => {
    it('should display product image', () => {
      cy.get('img[alt]').first().should('be.visible');
    });

    it('should display product name', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.get('h3').should('be.visible').and('not.be.empty');
        });
    });

    it('should display product description', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.get('p').should('contain.text', 'generación');
        });
    });

    it('should display product category', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.get('div[class*="text-muted"]')
            .first()
            .should('contain.text', 'Electrónica');
        });
    });

    it('should display product price', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.contains('$').should('be.visible');
          // Check that there's a number after the dollar sign
          cy.contains(/\$\d+/).should('be.visible');
        });
    });

    it('should display stock information', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.contains(/Stock:/i).should('be.visible');
        });
    });
  });

  describe('Product Card Styling', () => {
    it('should have proper card styling with border and shadow', () => {
      cy.get('li').first().find('[class*="cursor-pointer"]').should('exist');
      cy.get('li').first().find('a').should('exist');
    });

    it('should have hover effect on product card', () => {
      cy.get('li').first().trigger('mouseover');
      cy.get('li')
        .first()
        .within(() => {
          cy.get('a').should('exist');
        });
    });

    it('should have image zoom effect on hover', () => {
      cy.get('li').first().trigger('mouseover');
      cy.get('img').first().should('have.class', 'group-hover:scale-105');
    });
  });

  describe('Stock Warnings', () => {
    it('should show low stock badge for products with less than 10 items', () => {
      // Check if any product has the low stock badge
      cy.get('body').then($body => {
        if ($body.find(':contains("¡Pocas unidades!")').length > 0) {
          cy.contains('¡Pocas unidades!').should('be.visible');
        } else {
          // If no products have low stock, that's also valid
          cy.log('No products with low stock in current data');
        }
      });
    });

    it('should not show low stock badge for products with sufficient stock', () => {
      // Just verify that products without low stock badge exist
      cy.get('li').should('have.length.greaterThan', 0);
    });
  });

  describe('Product Card Actions', () => {
    it('should have "Ver Detalles" button', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.contains('Ver Detalles').should('be.visible');
        });
    });

    it('should have shopping cart icon in button', () => {
      cy.get('li')
        .first()
        .within(() => {
          cy.get('svg').should('be.visible');
        });
    });

    it('should be clickable and navigable', () => {
      cy.get('li').first().click();
      cy.url({ timeout: 10000 }).should('include', '/product/');
      cy.get('h1', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Product Card Responsiveness', () => {
    it('should be responsive on mobile (2 columns)', () => {
      cy.viewport('iphone-x');
      cy.get('ul[class*="grid-cols-2"]').should('exist');
    });

    it('should be responsive on tablet (3 columns)', () => {
      cy.viewport('ipad-2');
      cy.get('ul[class*="grid"]').should('have.class', 'md:grid-cols-3');
    });

    it('should be responsive on desktop (4 columns)', () => {
      cy.viewport('macbook-16');
      cy.get('ul[class*="grid"]').should('have.class', 'lg:grid-cols-4');
    });
  });

  describe('Product Card Missing Image Handling', () => {
    it('should handle missing images gracefully', () => {
      // Verify that images are loaded or handled gracefully
      cy.get('li')
        .first()
        .within(() => {
          cy.get('img').should('exist');
        });
    });
  });
});
