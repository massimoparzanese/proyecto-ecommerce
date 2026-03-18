import { MOCK_OBJECT_IDS } from '../../../fixtures/mockData';

describe('Edit Product Page - E2E', () => {
  const existingProduct = {
    id: MOCK_OBJECT_IDS.product1,
    name: 'Laptop Dell XPS 15',
    description: 'Laptop potente con procesador Intel i7',
    price: 1299.99,
    category: 'Electrónica',
    stock: 25,
    images: [
      'https://example.com/laptop1.jpg',
      'https://example.com/laptop2.jpg',
    ],
  };

  beforeEach(() => {
    // Setup: Login as admin programmatically
    cy.loginProgrammatic('admin@test.com', 'admin');

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

    // Mock products list
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: [existingProduct],
    }).as('getProducts');

    // Mock categories
    cy.intercept('GET', '**/products/categories', {
      statusCode: 200,
      body: ['Electrónica', 'Ropa', 'Hogar', 'Deportes'],
    }).as('getCategories');

    // Mock get single product
    cy.intercept('GET', `**/products/${MOCK_OBJECT_IDS.product1}`, {
      statusCode: 200,
      body: existingProduct,
    }).as('getProduct');
  });

  describe('Page Loading and Display', () => {
    it('should load existing product data in edit mode', () => {
      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Verify title changes to edit mode
      cy.contains('Editar Producto').should('be.visible');

      // Wait for form fields to be populated (ensures re-render is complete)
      cy.get('#name').should('have.value', existingProduct.name);
      cy.get('#description').should('have.value', existingProduct.description);
      cy.get('#price').should('have.value', existingProduct.price.toString());
      cy.get('#stock').should('have.value', existingProduct.stock.toString());
      cy.get('#category').should('have.value', existingProduct.category);

      // Verify images are loaded
      cy.get('input[type="url"]')
        .first()
        .should('have.value', existingProduct.images[0]);
      cy.get('input[type="url"]')
        .eq(1)
        .should('have.value', existingProduct.images[1]);
    });

    it('should show correct button text in edit mode', () => {
      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Button should show correct text
      cy.contains('button', 'Guardar Producto').should('be.visible');

      // Title should indicate edit mode
      cy.contains('Editar Producto').should('be.visible');
      cy.contains('Agregar Nuevo Producto').should('not.exist');
    });

    it('should handle product not found error', () => {
      cy.intercept('GET', `**/products/${MOCK_OBJECT_IDS.product1}`, {
        statusCode: 404,
        body: {
          message: 'Producto no encontrado',
        },
      }).as('productNotFound');

      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@productNotFound');

      // Should show error toast
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'no encontrado');

      // Should redirect to admin page
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });
  });

  describe('Complete Product Edit Flow', () => {
    it('should successfully edit product with updated fields', () => {
      cy.intercept('PUT', `**/products/${MOCK_OBJECT_IDS.product1}`, {
        statusCode: 200,
        body: {
          message: 'Producto actualizado',
          data: {
            ...existingProduct,
            name: 'Laptop Dell XPS 15 (Actualizado)',
            price: 1199.99,
            stock: 30,
          },
        },
      }).as('updateProduct');

      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for fields to be populated (ensures re-render is complete)
      cy.get('#name').should('have.value', existingProduct.name);
      cy.get('#price').should('have.value', existingProduct.price.toString());
      cy.get('#stock').should('have.value', existingProduct.stock.toString());

      // Update some fields - break up the commands to avoid detached elements
      cy.get('#name').clear();
      cy.get('#name').type('Laptop Dell XPS 15 (Actualizado)');
      cy.get('#price').clear();
      cy.get('#price').type('1199.99');
      cy.get('#stock').clear();
      cy.get('#stock').type('30');

      // Submit
      cy.contains('button', 'Guardar Producto').click();

      // Verify request
      cy.wait('@updateProduct').then(interception => {
        expect(interception.request.body).to.deep.include({
          name: 'Laptop Dell XPS 15 (Actualizado)',
          price: 1199.99,
          stock: 30,
        });
      });

      // Should show success message
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'actualizado exitosamente');

      // Should redirect to admin page
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });

    it('should edit product with category change', () => {
      cy.intercept('PUT', `**/products/${MOCK_OBJECT_IDS.product1}`, {
        statusCode: 200,
        body: {
          message: 'Producto actualizado',
          data: { ...existingProduct, category: 'Hogar' },
        },
      }).as('updateProduct');

      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for category field to be populated
      cy.get('#category').should('have.value', existingProduct.category);

      // Change category
      cy.get('#category').select('Hogar');

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@updateProduct').then(interception => {
        expect(interception.request.body.category).to.equal('Hogar');
      });
    });

    it('should edit product with new category', () => {
      cy.intercept('PUT', `**/products/${MOCK_OBJECT_IDS.product1}`, {
        statusCode: 200,
        body: {
          message: 'Producto actualizado',
          data: { ...existingProduct, category: 'Tecnología' },
        },
      }).as('updateProduct');

      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for form to be populated
      cy.get('#name').should('have.value', existingProduct.name);

      // NOW setup the refetch intercept (after initial fetch is done)
      cy.intercept('GET', '**/products/categories', {
        statusCode: 200,
        body: ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Tecnología'],
      }).as('refetchCategories');

      // Toggle to new category
      cy.contains('+ Crear nueva categoría').click();
      cy.get('#newCategory').type('Tecnología');

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@updateProduct').then(interception => {
        expect(interception.request.body.category).to.equal('Tecnología');
      });

      // Should refetch categories
      cy.wait('@refetchCategories');
    });

    it('should add and remove images during edit', () => {
      cy.intercept('PUT', `**/products/${MOCK_OBJECT_IDS.product1}`, {
        statusCode: 200,
        body: {
          message: 'Producto actualizado',
          data: existingProduct,
        },
      }).as('updateProduct');

      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for images to be loaded
      cy.get('input[type="url"]')
        .first()
        .should('have.value', existingProduct.images[0]);

      // Add a new image
      cy.contains('Agregar imagen').click();
      cy.get('input[type="url"]').eq(2).type('https://example.com/laptop3.jpg');

      // Remove first image
      cy.get('button[aria-label*="Eliminar"]').first().click();

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@updateProduct').then(interception => {
        expect(interception.request.body.images).to.have.length(2);
        expect(interception.request.body.images).to.not.include(
          existingProduct.images[0]
        );
        expect(interception.request.body.images).to.include(
          'https://example.com/laptop3.jpg'
        );
      });
    });
  });

  describe('Form Validation and Error Handling', () => {
    it('should handle edit validation errors', () => {
      cy.intercept('PUT', `**/products/${MOCK_OBJECT_IDS.product1}`, {
        statusCode: 400,
        body: {
          message: 'El precio debe ser mayor a 0',
        },
      }).as('updateProductError');

      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for price field to be populated
      cy.get('#price').should('have.value', existingProduct.price.toString());

      // Set invalid price - break up commands
      cy.get('#price').clear();
      cy.get('#price').type('-10');

      // Submit the form directly to bypass HTML5 client-side validation
      cy.get('form').invoke('attr', 'novalidate', 'novalidate');
      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@updateProductError');
      cy.get('[data-sonner-toast]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'precio debe ser mayor');
    });

    it('should handle network errors during edit', () => {
      cy.intercept('PUT', `**/products/${MOCK_OBJECT_IDS.product1}`, {
        forceNetworkError: true,
      }).as('networkError');

      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for name field to be populated
      cy.get('#name').should('have.value', existingProduct.name);

      // Break up commands to avoid detached elements
      cy.get('#name').clear();
      cy.get('#name').type('Updated Name');

      cy.contains('button', 'Guardar Producto').click();

      // Wait for error toast (network errors show toast with 'error' text)
      cy.get('[data-sonner-toast]', { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /error|failed/i);
    });

    it('should prevent double submission during edit', () => {
      cy.intercept('PUT', `**/products/${MOCK_OBJECT_IDS.product1}`, req => {
        req.reply({
          delay: 2000,
          statusCode: 200,
          body: { message: 'Success', data: existingProduct },
        });
      }).as('slowUpdate');

      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for name field to be populated
      cy.get('#name').should('have.value', existingProduct.name);

      // Break up commands
      cy.get('#name').clear();
      cy.get('#name').type('Updated Product');

      // Get the submit button
      const submitButton = cy.contains('button', 'Guardar Producto');

      // Click submit once
      submitButton.click();

      // Button should be disabled during submission
      submitButton.should('contain', 'Guardando...');

      // Try to click again (should be ignored)
      submitButton.click({ force: true });

      // Should only make one request
      cy.wait('@slowUpdate');
      cy.get('@slowUpdate.all').should('have.length', 1);
    });
  });

  describe('User Experience Features', () => {
    it('should show "Volver" button and navigate back', () => {
      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for form to load
      cy.get('#name').should('have.value', existingProduct.name);

      cy.contains('button', 'Volver').should('be.visible');
      cy.contains('button', 'Volver').click();
      cy.location('pathname').should('eq', '/admin');
    });

    it('should allow canceling during edit', () => {
      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Wait for name field to be populated
      cy.get('#name').should('have.value', existingProduct.name);

      // Modify a field - break up commands
      cy.get('#name').clear();
      cy.get('#name').type('Modified Name');

      // Cancel
      cy.contains('a button', 'Cancelar').click();

      // Should navigate away without saving
      cy.location('pathname').should('eq', '/admin');
    });
  });

  describe('Responsive Design', () => {
    it('should display properly on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Form should be visible and usable
      cy.get('#name').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should display properly on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      // Two-column layout for price/stock should work
      cy.get('#price').should('be.visible');
      cy.get('#stock').should('be.visible');
    });

    it('should display properly on desktop', () => {
      cy.viewport(1920, 1080);
      cy.visit(`/admin/product/${MOCK_OBJECT_IDS.product1}`);
      cy.wait('@getProduct');
      cy.wait('@getCategories');

      cy.get('form').should('be.visible');
    });
  });
});
