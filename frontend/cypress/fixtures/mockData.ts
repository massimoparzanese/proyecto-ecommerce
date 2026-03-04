// Mock data with valid MongoDB ObjectIds for Cypress tests
export const MOCK_OBJECT_IDS = {
  product1: '507f1f77bcf86cd799439011',
  product2: '507f1f77bcf86cd799439012',
  product3: '507f1f77bcf86cd799439013',
  user1: '507f1f77bcf86cd799439021',
  user2: '507f1f77bcf86cd799439023',
  admin1: '507f1f77bcf86cd799439022',
};

export const mockProducts = [
  {
    id: MOCK_OBJECT_IDS.product1,
    name: 'Samsung Galaxy Buds',
    description: 'Auriculares inalámbricos de última generación',
    price: 129.99,
    stock: 15,
    category: 'Electrónica',
    images: ['https://via.placeholder.com/300'],
  },
  {
    id: MOCK_OBJECT_IDS.product2,
    name: 'Monitor LG 27 pulgadas',
    description: 'Monitor 4K para gaming y productividad',
    price: 399.99,
    stock: 8,
    category: 'Electrónica',
    images: ['https://via.placeholder.com/300'],
  },
  {
    id: MOCK_OBJECT_IDS.product3,
    name: 'Teclado Mecánico RGB',
    description: 'Teclado gaming con switches mecánicos',
    price: 89.99,
    stock: 20,
    category: 'Accesorios',
    images: ['https://via.placeholder.com/300'],
  },
];

export const mockCategories = ['Electrónica', 'Ropa', 'Hogar', 'Accesorios'];

export const mockUsers = {
  admin: {
    id: MOCK_OBJECT_IDS.admin1,
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin' as const,
  },
  user: {
    id: MOCK_OBJECT_IDS.user1,
    name: 'Regular User',
    email: 'user@test.com',
    role: 'user' as const,
  },
};
