import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import groupRoutes from './routes/group.routes';
import resourceRoutes from './routes/resource.routes';
import sessionRoutes from './routes/session.routes';
import taskRoutes from './routes/task.routes';
import messageRoutes from './routes/message.routes';
import notificationRoutes from './routes/notification.routes';
import subjectRoutes from './routes/subject.routes';
import { logger } from './utils/logger';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/groups', groupRoutes);
app.use('/resources', resourceRoutes);
app.use('/sessions', sessionRoutes);
app.use('/tasks', taskRoutes);
app.use('/messages', messageRoutes);
app.use('/notifications', notificationRoutes);
app.use('/subjects', subjectRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 