import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/users/auth';
dotenv.config();

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [process.env.CLIENT_URL];
      if (!origin) return callback(null, true); // allow server-to-server or tools with no origin
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
  })
);

// Ruta de prueba
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Backend funcionando 🚀' });
});

app.use('/auth', authRoutes);
// Conexión a Mongo
const MONGO_URI = process.env.MONGO_URI || '';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('🟢 MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`🚀 Server corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Error MongoDB:', err);
  });
