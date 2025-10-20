// src/ws/ws-server.js
import { useServer } from 'graphql-ws/use/ws';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: process.env.AUTH0_JWKS_URI || 'https://dev-h76ls4zt4k166bjm.us.auth0.com/.well-known/jwks.json',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export function registerWsServer(wsServer, schema) {
  return useServer(
    {
      schema,
      onConnect: async (ctx) => {
        const authHeader = ctx.connectionParams?.Authorization || ctx.connectionParams?.authorization;
        const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;

        if (!token) {
          throw new Error('Missing auth token for websocket');
        }

        try {
          const decoded = await new Promise((resolve, reject) => {
            jwt.verify(
              token,
              getKey,
              {
                algorithms: ['RS256'],
                issuer: process.env.AUTH0_ISSUER ,
                audience: process.env.AUTH0_AUDIENCE,
              },
              (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
              }
            );
          });

          return { user: decoded };
        } catch (err) {
          console.warn('WS token verify failed:', err.message);
          throw new Error('Invalid token');
        }
      },
      context: (ctx, msg, args) => {
        return { user: ctx.user || null };
      },
    },
    wsServer
  );
}
