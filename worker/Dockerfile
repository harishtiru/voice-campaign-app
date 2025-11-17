FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
# Copy only package files first
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy worker source code
COPY . .
# Expose (not needed but safe)
EXPOSE 9001
# Start worker
CMD ["npm", "start"]

