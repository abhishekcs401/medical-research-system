# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire application
COPY . .
# Build the TypeScript project
RUN npm run build
# Expose the port that the app runs on
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start"]
