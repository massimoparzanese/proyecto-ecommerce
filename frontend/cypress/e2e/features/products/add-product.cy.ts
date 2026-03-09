import { MOCK_OBJECT_IDS } from '../../../fixtures/mockData';

describe('Add Product Page - E2E', () => {
  beforeEach(() => {
    // Setup: Login as admin programmatically
    cy.loginProgrammatic('admin@test.com', 'admin');
  });

  describe('Page Navigation and Access', () => {
    beforeEach(() => {
      // Mock common APIs with authenticated admin for these tests
      cy.mockCommonAPIs('authenticated-admin');
    });

    it('should navigate to add product page directly', () => {
      cy.visit('/admin/product');
      cy.location('pathname').should('include', '/admin/product');
      cy.contains('Agregar Nuevo Producto').should('be.visible');
    });

    it.skip('should redirect non-admin users', () => {
      // TODO: Implement admin middleware protection
      cy.loginProgrammatic('user@test.com', 'user');
      cy.visit('/admin/product');

      // Should redirect or show unauthorized
      cy.location('pathname').should('not.include', '/admin');
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching categories', () => {
      // Mock auth/me as authenticated admin
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: '507f1f77bcf86cd799439022',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
          },
        },
      }).as('authMe');

      // Mock products
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      // Mock categories with delay to capture loading state
      cy.intercept('GET', '**/products/categories', req => {
        req.reply({
          delay: 3000, // Long delay to capture loading state
          statusCode: 200,
          body: ['Test Category'],
        });
      }).as('slowCategories');

      cy.visit('/admin/product');

      // Should show loading state - check for loading option
      cy.get('#category option', { timeout: 2000 })
        .first()
        .should('contain', 'Cargando categorías...');

      // After categories load, select should show categories
      cy.wait('@slowCategories');
      cy.get('#category option')
        .first()
        .should('contain', 'Selecciona una categoría');
    });
  });

  describe('Complete Product Creation Flow', () => {
    beforeEach(() => {
      // Mock auth/me as authenticated admin
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: '507f1f77bcf86cd799439022',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
          },
        },
      }).as('authMe');

      // Mock products
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica', 'Ropa', 'Hogar', 'Deportes'],
      }).as('getCategories');

      cy.intercept('POST', '**/products', {
        statusCode: 201,
        body: {
          message: 'Producto creado',
          data: {
            id: MOCK_OBJECT_IDS.product1,
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            category: 'Electrónica',
            stock: 50,
            images: ['https://test.com/image.jpg'],
          },
        },
      }).as('createProduct');

      cy.visit('/admin/product');
      cy.wait('@getCategories');
    });

    it('should create product with all fields filled', () => {
      // Fill all fields
      cy.get('#name').type('Laptop Dell XPS 15');
      cy.get('#description').type(
        'Laptop potente con procesador Intel i7, 16GB RAM, SSD 512GB'
      );
      cy.get('#price').type('1299.99');
      cy.get('#stock').type('25');
      cy.get('#category').select('Electrónica');

      // Add multiple images
      cy.get('input[type="url"]')
        .first()
        .type('https://example.com/laptop1.jpg');
      cy.contains('Agregar imagen').click();
      cy.get('input[type="url"]').eq(1).type('https://example.com/laptop2.jpg');

      // Submit
      cy.contains('button', 'Guardar Producto').click();

      // Verify request
      cy.wait('@createProduct').then(interception => {
        expect(interception.request.body).to.deep.include({
          name: 'Laptop Dell XPS 15',
          price: 1299.99,
          category: 'Electrónica',
          stock: 25,
        });
        expect(interception.request.body.images).to.have.length(2);
      });

      // Should show success message in toast
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'Producto agregado exitosamente');

      // Should redirect to admin page
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });

    it('should create product with new category', () => {
      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes'],
      }).as('refetchCategories');

      // Toggle to new category
      cy.contains('+ Crear nueva categoría').click();

      // Fill form with new category
      cy.get('#name').type('Pelota de Fútbol');
      cy.get('#description').type('Pelota profesional talla 5');
      cy.get('#price').type('49.99');
      cy.get('#stock').type('100');
      cy.get('#newCategory').type('Juguetes');

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@createProduct').then(interception => {
        expect(interception.request.body.category).to.equal('Juguetes');
      });

      // Should refetch categories after creating product with new category
      cy.wait('@refetchCategories');
    });

    it('should create product without images (use default)', () => {
      cy.get('#name').type('Generic Product');
      cy.get('#description').type('A product without custom images');
      cy.get('#price').type('25.00');
      cy.get('#stock').type('10');
      cy.get('#category').select('Hogar');

      // Don't fill image field
      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@createProduct').then(interception => {
        // Should have at least one default image
        expect(interception.request.body.images).to.have.length.greaterThan(0);
        expect(interception.request.body.images[0]).to.include('unsplash');
      });
    });
  });

  describe('Form Validation and Error Handling', () => {
    beforeEach(() => {
      // Mock auth/me as authenticated admin
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: '507f1f77bcf86cd799439022',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
          },
        },
      }).as('authMe');

      // Mock products
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      cy.visit('/admin/product');
      cy.wait('@getCategories');
    });

    it('should show error when required fields are missing', () => {
      // Try to submit empty form
      cy.contains('button', 'Guardar Producto').click();

      // HTML5 validation should trigger
      cy.get('#name:invalid').should('exist');
    });

    it('should show error toast for server validation errors', () => {
      cy.intercept('POST', '**/products', {
        statusCode: 400,
        body: {
          message: 'Nombre del producto inválido o faltante',
        },
      }).as('createProductError');

      cy.get('#name').type('X'); // Too short
      cy.get('#description').type('Test');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#category').select('Electrónica');

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@createProductError');
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'Nombre del producto inválido');
    });

    it('should handle network errors', () => {
      cy.intercept('POST', '**/products', {
        forceNetworkError: true,
      }).as('networkError');

      cy.get('#name').type('Test Product');
      cy.get('#description').type('Description');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#category').select('Electrónica');

      cy.contains('button', 'Guardar Producto').click();

      // Should show network error toast
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /error/i);
    });

    it('should prevent double submission', () => {
      cy.intercept('POST', '**/products', req => {
        req.reply({
          delay: 2000,
          statusCode: 201,
          body: { message: 'Success', data: {} },
        });
      }).as('slowCreate');

      cy.get('#name').type('Test Product');
      cy.get('#description').type('Description');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#category').select('Electrónica');

      // Click submit twice rapidly
      cy.contains('button', 'Guardar Producto').click();
      cy.contains('button', 'Guardando...').click({ force: true });

      // Should only make one request
      cy.wait('@slowCreate');
      cy.get('@slowCreate.all').should('have.length', 1);
    });
  });

  describe('User Experience Features', () => {
    beforeEach(() => {
      // Mock auth/me as authenticated admin
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: '507f1f77bcf86cd799439022',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
          },
        },
      }).as('authMe');

      // Mock products
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');

      cy.visit('/admin/product');
      cy.wait('@getCategories');
    });

    it('should show "Volver" button and navigate back', () => {
      cy.contains('button', 'Volver').should('be.visible');
      cy.contains('button', 'Volver').click();
      cy.location('pathname').should('eq', '/admin');
    });

    it('should show image previews as user types URLs', () => {
      const imageUrl =
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';

      cy.get('input[type="url"]').first().type(imageUrl);

      // Wait for image to potentially load
      cy.wait(500);

      // Preview image should be rendered
      cy.get('img[alt*="Vista previa"]').should('exist');
    });

    it('should show helper text for optional fields', () => {
      cy.contains(
        'Si no proporcionas imágenes, se usará una por defecto'
      ).should('be.visible');
    });

    it('should show category creation hint', () => {
      cy.contains('+ Crear nueva categoría').click();
      cy.contains('Se creará una nueva categoría con este nombre').should(
        'be.visible'
      );
    });

    it('should allow canceling during form fill', () => {
      // Fill half the form
      cy.get('#name').type('Incomplete Product');
      cy.get('#price').type('99.99');

      // Cancel
      cy.contains('a button', 'Cancelar').click();

      // Should navigate away without saving
      cy.location('pathname').should('eq', '/admin');
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      // Mock auth/me as authenticated admin
      cy.intercept('GET', '**/auth/me', {
        statusCode: 200,
        body: {
          message: 'Usuario autenticado',
          data: {
            id: '507f1f77bcf86cd799439022',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
          },
        },
      }).as('authMe');

      // Mock products
      cy.intercept('GET', '**/products', {
        statusCode: 200,
        body: [],
      }).as('getProducts');

      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica'],
      }).as('getCategories');
    });

    it('should display properly on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/admin/product');
      cy.wait('@getCategories');

      // Form should be visible and usable
      cy.get('#name').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should display properly on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit('/admin/product');
      cy.wait('@getCategories');

      // Two-column layout for price/stock should work
      cy.get('#price').should('be.visible');
      cy.get('#stock').should('be.visible');
    });

    it('should display properly on desktop', () => {
      cy.viewport(1920, 1080);
      cy.visit('/admin/product');
      cy.wait('@getCategories');

      cy.get('form').should('be.visible');
    });
  });
});
