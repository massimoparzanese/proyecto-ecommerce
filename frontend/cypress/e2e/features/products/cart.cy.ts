import { mockProducts } from '../../../fixtures/mockData';

describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.mockCommonAPIs('authenticated-user');
    cy.loginProgrammatic('user@test.com', 'user');
    cy.visit('/');
    cy.wait('@getProducts');
  });

  it('shows empty state when there are no products in cart', () => {
    cy.get('button[aria-label="Abrir carrito"]').click();
    cy.contains('Tu carrito').should('be.visible');
    cy.contains('Aun no agregaste productos.').should('be.visible');

    cy.contains('button', 'Ver carrito completo').click();
    cy.url().should('include', '/cart');
    cy.contains('Tu carrito esta vacio').should('be.visible');
  });

  it('handles single product quantity updates and decrease-to-remove flow', () => {
    const product = mockProducts[0];

    cy.visit(`/product/${product.id}`);
    cy.wait(`@getProduct${product.id}`);
    cy.contains('button', 'Agregar al carrito').click();

    cy.get('button[aria-label="Abrir carrito"]').click();
    cy.contains('button', 'Ver carrito completo').click();

    cy.url().should('include', '/cart');
    cy.contains(product.name).should('be.visible');
    cy.contains('Productos').parent().contains('1').should('be.visible');

    cy.get(`button[aria-label="Aumentar cantidad de ${product.name}"]`).click();
    cy.contains('Productos').parent().contains('2').should('be.visible');

    cy.get(
      `button[aria-label="Disminuir cantidad de ${product.name}"]`
    ).click();
    cy.contains('Productos').parent().contains('1').should('be.visible');

    // Disminuir desde 1 debe eliminar el producto del carrito
    cy.get(
      `button[aria-label="Disminuir cantidad de ${product.name}"]`
    ).click();
    cy.contains('Tu carrito esta vacio').should('be.visible');
  });

  it('shows preview with first 3 selected products when there are many', () => {
    mockProducts.forEach(product => {
      cy.visit(`/product/${product.id}`);
      cy.wait(`@getProduct${product.id}`);
      cy.contains('button', 'Agregar al carrito').click();
    });

    cy.get('button[aria-label="Abrir carrito"]').click();

    cy.contains('Tu carrito').should('be.visible');
    cy.contains(mockProducts[0].name).should('be.visible');
    cy.contains(mockProducts[1].name).should('be.visible');
    cy.contains(mockProducts[2].name).should('be.visible');
    cy.contains('Ver carrito completo').should('be.visible');
    cy.contains('Mostrando 3 de 3 productos seleccionados.').should(
      'not.exist'
    );
  });

  it('handles multiple products: remove one, keep others, clear all and checkout placeholder', () => {
    const firstProduct = mockProducts[0];
    const secondProduct = mockProducts[1];

    [firstProduct, secondProduct].forEach(product => {
      cy.visit(`/product/${product.id}`);
      cy.wait(`@getProduct${product.id}`);
      cy.contains('button', 'Agregar al carrito').click();
    });

    cy.get('button[aria-label="Abrir carrito"]').click();
    cy.contains('button', 'Ver carrito completo').click();

    cy.url().should('include', '/cart');
    cy.contains(firstProduct.name).should('be.visible');
    cy.contains(secondProduct.name).should('be.visible');
    cy.contains('Productos').parent().contains('2').should('be.visible');

    cy.get(`button[aria-label="Eliminar ${firstProduct.name}"]`).click();
    cy.contains('dialog button', 'Eliminar').click();

    cy.get('main').within(() => {
      cy.contains(firstProduct.name).should('not.exist');
      cy.contains(secondProduct.name).should('be.visible');
    });
    cy.contains('Productos').parent().contains('1').should('be.visible');

    cy.contains('button', 'Comprar todo').click();
    cy.contains('Pago en desarrollo').should('be.visible');

    cy.contains('button', 'Vaciar carrito').click();
    cy.contains('dialog button', 'Vaciar carrito').click();
    cy.contains('Tu carrito esta vacio').should('be.visible');
  });

  it('shows preview message when there are more than 3 different products', () => {
    const extraProduct = {
      id: '507f1f77bcf86cd799439099',
      name: 'Producto Extra',
      description: 'Producto para validar preview parcial',
      price: 49.99,
      stock: 12,
      category: 'Accesorios',
      images: ['https://via.placeholder.com/300'],
    };

    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: [...mockProducts, extraProduct],
    }).as('getProductsWithExtra');

    cy.intercept('GET', `**/products/${extraProduct.id}`, {
      statusCode: 200,
      body: extraProduct,
    }).as('getProductExtra');

    cy.visit('/');
    cy.wait('@getProductsWithExtra');

    [...mockProducts, extraProduct].forEach(product => {
      cy.visit(`/product/${product.id}`);
      if (product.id === extraProduct.id) {
        cy.wait('@getProductExtra');
      } else {
        cy.wait(`@getProduct${product.id}`);
      }
      cy.contains('button', 'Agregar al carrito').click();
    });

    cy.get('button[aria-label="Abrir carrito"]').click();
    cy.contains('Mostrando 3 de 4 productos seleccionados.').should(
      'be.visible'
    );
  });
});
