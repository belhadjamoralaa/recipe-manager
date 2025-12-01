import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import router from './routes';
import notFoundHandler from './middleware/notFoundHandler';
import errorHandler from './middleware/errorHandler';

dotenv.config();

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    const app = express();
    const PORT = process.env.PORT || 4000;

    app.use(cors());
    app.use(express.json());

    app.use('/api', router);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
