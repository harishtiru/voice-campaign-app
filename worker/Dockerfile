FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
# Copy only package files first
COPY package*.json ./
# Install dependencies
RUN npm ci
# Install kubectl in Alpine
RUN apk add --no-cache curl \
    && curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
    && rm kubectl

# Copy worker source code
COPY . .
COPY kubeconfig /tmp/kubeconfig
RUN chmod 600 /tmp/kubeconfig
RUN export KUBECONFIG=/tmp/kubeconfig
# Expose (not needed but safe)
EXPOSE 9001
# Start worker
CMD ["npm", "start"]

