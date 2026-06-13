# Build stage
FROM node:20-alpine AS builder

# Accept build arguments FIRST before anything else
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app

# Install dependencies
COPY package*.json ./
# If you are using pnpm/bun, adjust this step accordingly.
RUN npm ci

# Copy source and build app
COPY . .

# Log the variable during build to verify it exists
RUN echo "Building with VITE_API_BASE_URL=${VITE_API_BASE_URL}"
RUN npm run build

# Run stage (static server with Node + serve)
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
