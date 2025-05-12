import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request, Response } from 'express';
import { ClientRequest, IncomingMessage, ServerResponse } from 'http';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface CreateProxyOptions {
  target: string;
  label: string;
  injectUserHeaders?: boolean;
}

export function createCustomProxy({
  target,
  label,
  injectUserHeaders = false,
}: CreateProxyOptions) {
  const proxyOptions: Options = {
    target,
    changeOrigin: true,
    pathRewrite: (_path, req) => req.originalUrl,
    onProxyReq: (proxyReq: ClientRequest, req: IncomingMessage, _res: ServerResponse) => {
      const originalUrl = req.url ?? '';
      const requestIdHeader = 'x-request-id';
      //Generate or forward x-request-id
      let requestId = req.headers[requestIdHeader] as string;
      if (!requestId) {
        requestId = uuidv4();
        req.headers[requestIdHeader] = requestId;
      }
      proxyReq.setHeader(requestIdHeader, requestId);
      logger.info(
        `[${label} Proxy] ➜ Forwarding request to: ${target}${originalUrl} | x-request-id: ${requestId}`
      );

      if (injectUserHeaders) {
        const user = (req as any).user;
        if (user) {
          proxyReq.setHeader('x-user-id', user.id);
          proxyReq.setHeader('x-user-email', user.email);
          proxyReq.setHeader('x-user-role', user.role);
        }
      }
    },
    onError: (err: Error, req: Request, res: Response) => {
      logger.error(`[${label} Proxy] ❌ Proxy error: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Proxy error',
          message: err.message,
        });
      }
    },
  };

  return createProxyMiddleware(proxyOptions);
}
