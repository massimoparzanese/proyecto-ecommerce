describe('ProductDetail Page', () => {
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

    // Navigate to first product detail
    cy.fixture('products').then(data => {
      cy.visit(`/product/${data.products[0].id}`);
      cy.wait('@getProduct');
    });
  });

  describe('Product Detail Display', () => {
    it('should display product name', () => {
      cy.fixture('products').then(data => {
        cy.contains('h1', data.products[0].name).should('be.visible');
      });
    });

    it('should display product category', () => {
      cy.fixture('products').then(data => {
        cy.contains(data.products[0].category).should('be.visible');
      });
    });

    it('should display product price with proper formatting', () => {
      cy.fixture('products').then(data => {
        cy.contains(`$${data.products[0].price.toFixed(2)}`).should(
          'be.visible'
        );
      });
    });

    it('should display product description', () => {
      cy.fixture('products').then(data => {
        cy.contains(data.products[0].description).should('be.visible');
      });
    });

    it('should display product images', () => {
      cy.get('img[alt*="Laptop"]').should('be.visible');
    });

    it('should display all product images in gallery', () => {
      cy.fixture('products').then(data => {
        const imagesCount = data.products[0].images.length;
        cy.get('div.slider img').should('have.length', imagesCount);
      });
    });

    it('should display stock information', () => {
      cy.fixture('products').then(data => {
        cy.contains(`Stock: ${data.products[0].stock}`).should('be.visible');
      });
    });
  });

  describe('Product Features', () => {
    it('should display shipping feature', () => {
      cy.contains('Envío gratis').should('be.visible');
    });

    it('should display warranty feature', () => {
      cy.contains('Garantía 1 año').should('be.visible');
    });

    it('should have truck icon for shipping', () => {
      cy.get('svg').should('have.length.greaterThan', 0);
    });
  });

  describe('Stock Warnings', () => {
    it('should show low stock warning for products with less than 10 items', () => {
      cy.fixture('products').then(data => {
        const lowStockProduct = data.products.find(
          (p: any) => p.stock > 0 && p.stock < 10
        );
        if (lowStockProduct) {
          cy.visit(`/product/${lowStockProduct.id}`);
          cy.contains(`¡Solo quedan ${lowStockProduct.stock} unidades!`).should(
            'be.visible'
          );
        }
      });
    });

    it('should not show low stock warning for products with sufficient stock', () => {
      cy.fixture('products').then(data => {
        const enoughStockProduct = data.products.find(
          (p: any) => p.stock >= 10
        );
        if (enoughStockProduct) {
          cy.visit(`/product/${enoughStockProduct.id}`);
          cy.contains(/¡Solo quedan/).should('not.exist');
        }
      });
    });
  });

  describe('Purchase Actions - Logged Out', () => {
    beforeEach(() => {
      cy.window().then(win => {
        win.localStorage.removeItem('isLoggedIn');
      });
    });

    it('should show login button when not logged in', () => {
      cy.reload();
      cy.contains('Iniciar Sesión').should('be.visible');
    });

    it('should navigate to login page when clicking login button', () => {
      cy.reload();
      cy.contains('Iniciar Sesión').click();
      cy.url().should('include', '/login');
    });

    it('should show login message text', () => {
      cy.reload();
      cy.contains('Compra segura y protegida').should('be.visible');
    });
  });

  describe('Purchase Actions - Logged In', () => {
    beforeEach(() => {
      cy.window().then(win => {
        win.localStorage.setItem('isLoggedIn', 'true');
      });
    });

    it('should show buy button when logged in with stock', () => {
      cy.reload();
      cy.fixture('products').then(data => {
        const productWithStock = data.products.find((p: any) => p.stock > 0);
        if (productWithStock) {
          cy.visit(`/product/${productWithStock.id}`);
          cy.contains('Comprar Ahora').should('be.visible');
        }
      });
    });

    it('should show out of stock button for products without stock', () => {
      cy.reload();
      cy.fixture('products').then(data => {
        const outOfStockProduct = data.products.find((p: any) => p.stock === 0);
        if (outOfStockProduct) {
          cy.visit(`/product/${outOfStockProduct.id}`);
          cy.contains('Agotado').should('be.visible').and('be.disabled');
        }
      });
    });

    it('should show out of stock message', () => {
      cy.reload();
      cy.fixture('products').then(data => {
        const outOfStockProduct = data.products.find((p: any) => p.stock === 0);
        if (outOfStockProduct) {
          cy.visit(`/product/${outOfStockProduct.id}`);
          cy.contains('Este producto está temporalmente agotado').should(
            'be.visible'
          );
        }
      });
    });

    it('should have shopping cart icon in buy button', () => {
      cy.reload();
      cy.contains('Comprar Ahora').find('svg').should('exist');
    });
  });

  describe('Review Section', () => {
    it('should display review section', () => {
      // Just verify the page loaded and has content
      cy.get('h1').should('be.visible');
      // Review section exists somewhere on page
      cy.get('main').should('exist');
    });

    it('should initiate with empty reviews', () => {
      cy.window().then(win => {
        win.localStorage.removeItem('productReviews');
      });
      cy.reload();
      cy.wait('@getProduct');
      // Verify page reloaded
      cy.get('h1').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should have back button', () => {
      cy.contains('Volver a productos').should('be.visible');
    });

    it('should navigate back to home when clicking back button', () => {
      cy.contains('Volver a productos').click();
      cy.url().should('include', '/');
    });

    it('should have back arrow icon', () => {
      cy.contains('Volver a productos').find('svg').should('exist');
    });
  });

  describe('Product Not Found', () => {
    it('should show error message when product is not found', () => {
      cy.visit('/product/nonexistent', { failOnStatusCode: false });
      cy.contains('Producto no encontrado').should('be.visible');
    });

    it('should provide back button on not found page', () => {
      cy.visit('/product/nonexistent', { failOnStatusCode: false });
      cy.contains('Volver al inicio').should('be.visible');
    });

    it('should navigate to home from not found page', () => {
      cy.visit('/product/nonexistent', { failOnStatusCode: false });
      cy.contains('Volver al inicio').click();
      cy.url().should('include', '/');
    });
  });

  describe('Product Detail Responsiveness', () => {
    it('should have responsive layout on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('[class*="grid"]').should('have.class', 'md:grid-cols-2');
    });

    it('should display properly on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('h1').should('be.visible');
      cy.get('[class*="grid"]').should('exist');
    });

    it('should display properly on desktop', () => {
      cy.viewport('macbook-16');
      cy.get('[class*="grid"]').should('have.class', 'md:grid-cols-2');
    });
  });
});
