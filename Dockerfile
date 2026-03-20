# Build Frontend
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build Backend
FROM node:20 AS backend-builder
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Production Image
FROM node:20-slim
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend/package.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/src/db/migrations ./backend/src/db/migrations
COPY backend/knexfile.ts ./backend/knexfile.ts

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Run migrations and start server
CMD npx knex migrate:latest && node dist/src/index.js
