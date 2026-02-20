import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
// Add other environment variables as needed
export const DB_URI =
  process.env.DB_URI || 'mongodb://localhost:27017/ecommerce';

export const PORT = process.env.PORT || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const NODE_ENV = process.env.NODE_ENV || 'development';
