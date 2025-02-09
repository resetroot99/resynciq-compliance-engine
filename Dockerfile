FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Start the app
CMD ["npm", "start"] 