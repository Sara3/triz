FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files
COPY . .

# Set environment variables
ENV VITE_API_BASE_URL=http://localhost:8000/api

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Give ownership to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Build for production
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose port
EXPOSE 5173

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

# Start development server (use this for development)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production alternative (uncomment to use):
# CMD ["serve", "-s", "dist", "-l", "5173"] 