# Base Image
FROM node:22-alpine

# Working Directory
WORKDIR /app

# Package files copy
COPY package*.json ./

# Install dependencies
RUN npm install

# Project files copy
COPY . .

# Expose backend port
EXPOSE 8000

# Start application
CMD ["npm", "start"]