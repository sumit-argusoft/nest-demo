import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpAdapter().getInstance() as express.Express;

  // Auth middleware: simple Bearer token presence check
  // server.use((req: Request, res: Response, next: NextFunction) => {
  //   if (req.path === '/health') return next();
  //   const auth = req.headers.authorization;
  //   if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  //   const parts = auth.split(' ');
  //   if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization format' });
  //   const token = parts[1];
  //   if (!token) return res.status(401).json({ message: 'Invalid token' });
  //   next();
  // });

  // Load proxy map
  const proxyPath = process.env.PROXY_MAP_PATH || path.join(__dirname, './config/proxy-map.json');
  if (!fs.existsSync(proxyPath)) {
    console.error('Proxy map not found at', proxyPath);
  } else {
    const raw = fs.readFileSync(proxyPath, 'utf-8');
    const proxyMap = JSON.parse(raw) as Record<string,string>;
    Object.keys(proxyMap).forEach(route => {
      const target = proxyMap[route];
      const options: Options = { target, changeOrigin: true, pathRewrite: { ['^' + route]: '' } };
      server.use(route, createProxyMiddleware(options));
      console.log(`Proxy enabled: ${route} -> ${target}`);
    });
  }

  server.get('/health', (req, res) => res.json({ status: 'ok' }));

  await app.listen(3000);
  console.log('Gateway running on port 3000');
}
bootstrap();
