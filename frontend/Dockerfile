# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Copy only package files
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy rest of the frontend source code
COPY . .
# Build Next.js app
RUN npm run build
# --- Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy package files for production install
COPY package*.json ./
# Install ONLY production dependencies
RUN npm ci --production
# Copy build output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
EXPOSE 3000
#CMD ["npm", "start"]
CMD ["node", ".next/standalone/server.js"]
