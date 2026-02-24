import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { seedUsers } from './users';
import { seedProducts } from './products';
import { DB_URI } from '../config';

const MONGO_URI = DB_URI;

async function runSeeds() {
  if (!MONGO_URI) throw new Error('MONGO_URI not set in env');
  await mongoose.connect(MONGO_URI);
  try {
    await seedUsers();
    await seedProducts();
    // await seedOtherEntities();
    console.log('All seeds finished');
  } finally {
    await mongoose.disconnect();
  }
}

runSeeds().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
