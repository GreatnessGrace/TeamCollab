import express from 'express';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth.routes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);

export default app;