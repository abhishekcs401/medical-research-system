# Use Node.js base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose port
EXPOSE 3000

# Start the compiled app
CMD ["node", "dist/index.js"]
