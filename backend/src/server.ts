import express from 'express';
import { Server } from 'http';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';

import bootstrap from './bootstrap/index';
import Logger from './middleware/logger';
import routes from './routes/index';
import authRouter from './routes/auth.route';
import { authenticateToken } from './controllers/auth.controller';
import * as errorMiddleware from './middleware/error';
import { getMongoDB } from './services/mongodb.service';

config();

const PORT = process.env.PORT;
const origins = `${process.env.ALLOWED_ORIGINS}`.split(',');
const HOST = process.env.HOST ?? 'http://[::1]';

const corsOptions = {
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  origin: origins
};

let server: Server;
const app = express();

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api', authenticateToken, routes);
app.get('/', (req, res) => {
  Logger.info('[server] 🚀 Welcome to the backend server');
  res.send('I am healthy!! ❤️');
});
app.use('*', (req, res) => {
  Logger.error(`[server] 🚨 Route not found: ${req.originalUrl}`);
  res.status(404).send('Not Found');
});

// Convert the errors to appropriate format
app.use(errorMiddleware.errorConverter);

// Handle errors
app.use(errorMiddleware.errorHandler);

const closeMongoDBConnection = async () => {
  try {
    await getMongoDB()?.connection?.close();
    Logger.info('Closed mongodb connection');
  } catch (e) {
    Logger.error(e);
  }
};

const exitHandler = () => {
  if (server) {
    server.close(() => {
      Logger.info('Server closed');
      closeMongoDBConnection().then(() => {
        process.exit(1);
      });
    });
  } else {
    closeMongoDBConnection().then(() => {
      process.exit(1);
    });
  }
};

const unexpectedErrorHandler = (error: Error) => {
  Logger.error(error.message);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

if (PORT) {
  bootstrap().then(() => {
    server = app.listen(PORT, () => {
      Logger.info(` [server] 🚀 @ ${HOST}:${PORT}`);
    });
  });
} else {
  Logger.error(' [server] 🚨 PORT is not defined.');
}
