describe('ProductCard Component', () => {
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

  describe('Product Card Display', () => {
    it('should display product image', () => {
      cy.get('img[alt*="Laptop"]').should('be.visible');
    });

    it('should display product name', () => {
      cy.fixture('products').then(data => {
        cy.contains(data.products[0].name).should('be.visible');
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
          cy.contains('1299.99').should('be.visible');
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
      // Find a product with low stock
      cy.fixture('products').then(data => {
        const lowStockProduct = data.products.find(
          (p: any) => p.stock > 0 && p.stock < 10
        );
        if (lowStockProduct) {
          cy.contains(lowStockProduct.name)
            .parent()
            .parent()
            .within(() => {
              cy.contains('¡Pocas unidades!').should('be.visible');
            });
        }
      });
    });

    it('should not show low stock badge for products with sufficient stock', () => {
      cy.fixture('products').then(data => {
        const mouseIndex = data.products.findIndex((p: any) => p.stock >= 10);
        cy.get('li')
          .eq(mouseIndex)
          .within(() => {
            cy.contains('¡Pocas unidades!').should('not.exist');
          });
      });
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
      cy.wait('@getProduct');
      cy.url().should('include', '/product/');
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
      cy.fixture('products').then(data => {
        const productWithoutImage = {
          ...data.products[0],
          images: [],
        };
        cy.intercept('GET', '**/products', {
          body: [productWithoutImage],
        }).as('getProductsNoImage');
      });

      cy.reload();
      cy.wait('@getProductsNoImage');
      cy.get('li')
        .first()
        .within(() => {
          cy.contains('Sin imagen').should('be.visible');
        });
    });
  });
});
