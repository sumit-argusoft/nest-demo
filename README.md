NestJS microservices monorepo (minimal demo)
Services: gateway, user-service, order-service
Usage:
  docker-compose up --build
Gateway -> http://localhost:3000 (proxy to /users and /orders)
User service -> http://localhost:3001
Order service -> http://localhost:3002
Gateway expects a Bearer token in Authorization header (any non-empty token accepted for demo).
