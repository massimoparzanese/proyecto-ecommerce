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
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/es/galaxy-s21/gallery/es-galaxy-s21-5g-g991-sm-g991bzadeub-368499358?$720_576_PNG$',
    ],
  },
  {
    name: 'Auriculares Sony WH-1000XM4',
    description:
      'Auriculares inalámbricos con cancelación de ruido líder en la industria.',
    price: 349.99,
    category: 'Accesorios',
    stock: 30,
    images: ['https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg'],
  },
  {
    name: 'Laptop Dell XPS 13',
    description:
      'Portátil ultraligero con pantalla táctil 4K y procesador Intel i7.',
    price: 1299.99,
    category: 'Computadoras',
    stock: 20,
    images: [
      'https://i.dell.com/sites/csimages/Video_Imagery/all/xps-13-9300-laptop.jpg',
    ],
  },
  {
    name: 'Cámara Canon EOS R5',
    description: 'Cámara profesional sin espejo con grabación de video en 8K.',
    price: 3899.99,
    category: 'Fotografía',
    stock: 10,
    images: ['https://www.canon.es/media/eos-r5-hero_tcm86-1915976.jpg'],
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
