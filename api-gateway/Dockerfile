FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and lock file first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the app (src, dist, etc.)
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 4000

# Start the server
CMD ["npm", "run", "start"]
