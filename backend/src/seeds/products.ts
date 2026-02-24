import { ProductRepository } from '../repositories/product';

const productRepository = new ProductRepository();

const seedProductsData = [
  {
    name: 'Smartphone Samsung Galaxy S21',
    description:
      'Un smartphone de última generación con cámara de alta resolución y pantalla AMOLED.',
    price: 799.99,
    category: 'Electrónica',
    stock: 50,
    images: ['https://picsum.photos/seed/smartphone/800/800'],
  },
  {
    name: 'Auriculares Sony WH-1000XM4',
    description:
      'Auriculares inalámbricos con cancelación de ruido líder en la industria.',
    price: 349.99,
    category: 'Accesorios',
    stock: 30,
    images: ['https://picsum.photos/seed/headphones/800/800'],
  },
  {
    name: 'Laptop Dell XPS 13',
    description:
      'Portátil ultraligero con pantalla táctil 4K y procesador Intel i7.',
    price: 1299.99,
    category: 'Computadoras',
    stock: 20,
    images: ['https://picsum.photos/seed/laptop/800/800'],
  },
  {
    name: 'Cámara Canon EOS R5',
    description: 'Cámara profesional sin espejo con grabación de video en 8K.',
    price: 3899.99,
    category: 'Fotografía',
    stock: 10,
    images: ['https://picsum.photos/seed/camera/800/800'],
  },
];

export async function seedProducts() {
  for (const p of seedProductsData) {
    const existing = await productRepository.getByName(p.name);
    if (existing) {
      console.log('Skipping (exists):', p.name);
      continue;
    }
    const created = await productRepository.create(p);
    console.log('Created:', created.name);
  }
}
