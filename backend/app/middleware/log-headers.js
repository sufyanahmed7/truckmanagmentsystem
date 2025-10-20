// src/middleware/log-headers.js
export default function logHeaders(req, res, next) {
  console.log('== Incoming', req.method, req.url);
  console.log('Authorization header:', req.headers.authorization);
  next();
}
