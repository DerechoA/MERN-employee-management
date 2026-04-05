# Backend Dockerfile
FROM node:24-slim

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY src ./src

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]