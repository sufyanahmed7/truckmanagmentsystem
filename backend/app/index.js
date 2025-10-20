// src/server.ts
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';

import logHeaders from './middleware/log-headers.js';
import checkJwt from './middleware/auth-check.js';

// Import contact GraphQL
import { contactTypeDefs } from './graphql/Contact/types.js';
import { contactResolvers } from './graphql/Contact/resolvers.js';

// Import Item GraphQL
import { itemTypeDefs } from './graphql/Item/types.js';
import { itemResolvers } from './graphql/Item/resolvers.js';

// Import Job GraphQL
import { jobTypeDefs } from './graphql/Job/types.js';
import { jobResolvers } from './graphql/Job/resolvers.js';

import { WebSocketServer } from 'ws';
import { registerWsServer } from './ws/ws-server.js';

const PORT = process.env.PORT || 8000;

async function start() {
  // -----------------------
  // MONGODB
  // -----------------------
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  const app = express();
  const httpServer = http.createServer(app);

  // -----------------------
  // MIDDLEWARE
  // -----------------------
  app.use(morgan('dev'));
  app.use(logHeaders);
  app.use(cors());
  app.use(bodyParser.json());

  // OPTIONS preflight
  app.use('/graphql', (req, res, next) => {
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // JWT protection
  app.use('/graphql', checkJwt);

  // -----------------------
  // GRAPHQL
  // -----------------------
  const schema = makeExecutableSchema({
    typeDefs: [contactTypeDefs, itemTypeDefs, jobTypeDefs], // Add jobTypeDefs
    resolvers: [contactResolvers, itemResolvers, jobResolvers], // Add jobResolvers
  });

  const server = new ApolloServer({ schema });
  await server.start();

  // Apollo middleware with user in context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const rawAuth = req.headers.authorization || '';
        const token = rawAuth.split(' ')[1] || null;
        const user = req.auth || null; // JWT decoded token
        return { token, user };
      },
    })
  );

  // -----------------------
  // SUBSCRIPTIONS
  // -----------------------
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  registerWsServer(wsServer, schema);

  // -----------------------
  // START SERVER
  // -----------------------
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error('Server start error:', err);
});
