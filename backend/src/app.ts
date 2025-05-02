import express from 'express';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/health', healthRoutes);

export default app;