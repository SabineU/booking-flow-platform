# Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_ENABLE_MSW=true
RUN npm run build

# Stage 2: Serve the built app
FROM node:22-alpine
WORKDIR /app

# Install vite globally (or locally) to avoid npx download warning
RUN npm install -g vite

# Copy the built 'dist' folder from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Now 'vite preview' will use the globally installed vite
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
