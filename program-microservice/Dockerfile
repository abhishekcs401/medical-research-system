# Use official Node.js Alpine image for a smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application (excluding files in .dockerignore)
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start"]
