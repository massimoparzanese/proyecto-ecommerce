import { MOCK_OBJECT_IDS } from '../../../fixtures/mockData';

describe('ProductForm Component', () => {
  beforeEach(() => {
    // Mock common APIs
    cy.mockCommonAPIs('authenticated-admin');

    // Login as admin to access product form
    cy.loginProgrammatic('admin@test.com', 'admin');

    cy.visit('/admin/product');
    cy.wait('@getCategories');
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      cy.get('#name').should('be.visible');
      cy.get('#description').should('be.visible');
      cy.get('#price').should('be.visible');
      cy.get('#stock').should('be.visible');
      cy.get('#category').should('be.visible');
    });

    it('should display category options from API', () => {
      cy.get('#category').should('not.be.disabled');
      cy.get('#category option').should('have.length.greaterThan', 1);
      cy.get('#category option').eq(1).should('contain', 'Electrónica');
    });

    it('should have submit and cancel buttons', () => {
      cy.contains('button', 'Guardar Producto').should('be.visible');
      cy.contains('a button', 'Cancelar').should('be.visible');
    });
  });

  describe('Form Validation', () => {
    it('should not submit with empty required fields', () => {
      cy.contains('button', 'Guardar Producto').click();

      // HTML5 validation should prevent submit
      cy.get('#name:invalid').should('exist');
    });

    it('should require positive numbers for price', () => {
      cy.get('#price').type('-10');
      cy.get('#price').should('have.attr', 'min', '0');
    });

    it('should require positive integers for stock', () => {
      cy.get('#stock').type('-5');
      cy.get('#stock').should('have.attr', 'min', '0');
    });
  });

  describe('Category Management', () => {
    it('should toggle between existing and new category', () => {
      // Initially showing select
      cy.get('#category').should('be.visible');
      cy.get('#newCategory').should('not.exist');

      // Click to create new category
      cy.contains('+ Crear nueva categoría').click();

      // Should show input for new category
      cy.get('#newCategory').should('be.visible');
      cy.get('#category').should('not.exist');

      // Should show back button
      cy.contains('← Seleccionar existente').should('be.visible');
    });

    it('should allow creating a new category', () => {
      cy.contains('+ Crear nueva categoría').click();
      cy.get('#newCategory').type('Nueva Categoría');
      cy.get('#newCategory').should('have.value', 'Nueva Categoría');
    });
  });

  describe('Image Management', () => {
    it('should start with one empty image field', () => {
      cy.get('input[type="url"]').should('have.length', 1);
    });

    it('should add image fields up to maximum of 5', () => {
      // Add 4 more images (total 5)
      for (let i = 0; i < 4; i++) {
        cy.contains('Agregar imagen').click();
      }

      cy.get('input[type="url"]').should('have.length', 5);
      cy.contains('Agregar imagen').should('not.exist');
    });

    it('should remove image fields', () => {
      // Add a second image
      cy.contains('Agregar imagen').click();
      cy.get('input[type="url"]').should('have.length', 2);

      // Remove button should appear
      cy.get('button[aria-label="Eliminar imagen"]').first().click();
      cy.get('input[type="url"]').should('have.length', 1);
    });

    it('should show image preview when valid URL is entered', () => {
      const imageUrl =
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
      cy.get('input[type="url"]').first().type(imageUrl);

      // Preview should be visible
      cy.get('img[alt*="Vista previa"]').should('be.visible');
      cy.get('img[alt*="Vista previa"]').should('have.attr', 'src', imageUrl);
    });

    it('should handle image load error with fallback', () => {
      const invalidUrl = 'https://invalid-image-url.com/fake.jpg';
      cy.get('input[type="url"]').first().type(invalidUrl);

      // Should show preview with error handling
      cy.get('img[alt*="Vista previa"]').should('exist');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/products', {
        statusCode: 201,
        body: {
          message: 'Producto creado exitosamente',
          data: {
            id: MOCK_OBJECT_IDS.product1,
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            category: 'Electrónica',
            stock: 10,
            images: ['https://test.com/image.jpg'],
          },
        },
      }).as('createProduct');
    });

    it('should submit form with valid data', () => {
      cy.get('#name').type('Smartphone XYZ');
      cy.get('#description').type(
        'Un smartphone increíble con todas las características'
      );
      cy.get('#price').type('599.99');
      cy.get('#stock').type('25');
      cy.get('#category').select('Electrónica');
      cy.get('input[type="url"]').first().type('https://test.com/phone.jpg');

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@createProduct').its('request.body').should('deep.include', {
        name: 'Smartphone XYZ',
        description: 'Un smartphone increíble con todas las características',
        price: 599.99,
        category: 'Electrónica',
        stock: 25,
      });

      // Should redirect to admin page
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });

    it('should submit with new category', () => {
      cy.contains('+ Crear nueva categoría').click();

      cy.get('#name').type('New Product');
      cy.get('#description').type('Description');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#newCategory').type('Categoría Nueva');

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@createProduct').its('request.body').should('include', {
        category: 'Categoría Nueva',
      });
    });

    it('should disable submit button while submitting', () => {
      cy.intercept('POST', '**/products', req => {
        req.reply({
          delay: 1000,
          statusCode: 201,
          body: { message: 'Success', data: {} },
        });
      }).as('slowCreate');

      cy.get('#name').type('Test Product');
      cy.get('#description').type('Description');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#category').select('Electrónica');

      cy.contains('button', 'Guardar Producto').click();

      // Button should show loading state
      cy.contains('button', 'Guardando...').should('be.visible');
      cy.contains('button', 'Guardando...').should('be.disabled');

      // Cancel button should also be disabled
      cy.contains('a button', 'Cancelar').should('be.disabled');
    });

    it('should use default image if none provided', () => {
      cy.get('#name').type('Product Without Image');
      cy.get('#description').type('Description');
      cy.get('#price').type('50');
      cy.get('#stock').type('5');
      cy.get('#category').select('Ropa');

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@createProduct')
        .its('request.body.images')
        .should('have.length.greaterThan', 0);
    });
  });

  describe('Error Handling', () => {
    it('should display error message on submission failure', () => {
      cy.intercept('POST', '**/products', {
        statusCode: 400,
        body: {
          message: 'Error al crear el producto',
        },
      }).as('createProductError');

      cy.get('#name').type('Test Product');
      cy.get('#description').type('Description');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#category').select('Electrónica');

      cy.contains('button', 'Guardar Producto').click();

      cy.wait('@createProductError');

      // Should show error toast (assuming you're using sonner)
      cy.contains('Error al crear el producto', { timeout: 10000 }).should(
        'be.visible'
      );

      // Should stay on same page (/admin/product)
      cy.location('pathname').should('eq', '/admin/product');
    });

    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '**/products', {
        forceNetworkError: true,
      }).as('networkError');

      cy.get('#name').type('Test Product');
      cy.get('#description').type('Description');
      cy.get('#price').type('99.99');
      cy.get('#stock').type('10');
      cy.get('#category').select('Electrónica');

      cy.contains('button', 'Guardar Producto').click();

      // Should show network error message
      cy.contains(/error/i).should('be.visible');
    });
  });

  describe('Cancel Button', () => {
    it('should navigate back to admin page when cancel is clicked', () => {
      cy.contains('a button', 'Cancelar').click();
      cy.location('pathname', { timeout: 5000 }).should('eq', '/admin');
    });

    it('should not submit form when cancel is clicked', () => {
      cy.intercept('POST', '**/products').as('createProduct');

      cy.get('#name').type('Test Product');
      cy.contains('a button', 'Cancelar').click();

      cy.get('@createProduct.all').should('have.length', 0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      cy.get('label[for="name"]').should('contain', 'Nombre del Producto');
      cy.get('label[for="description"]').should('contain', 'Descripción');
      cy.get('label[for="price"]').should('contain', 'Precio');
      cy.get('label[for="stock"]').should('contain', 'Stock');
      cy.get('label[for="category"]').should('contain', 'Categoría');
    });

    it('should mark required fields with asterisk', () => {
      cy.contains('label', 'Nombre del Producto *').should('be.visible');
      cy.contains('label', 'Descripción *').should('be.visible');
    });

    it('should have aria-label on remove image button', () => {
      cy.contains('Agregar imagen').click();
      cy.get('button[aria-label="Eliminar imagen"]').should('exist');
    });
  });
});
