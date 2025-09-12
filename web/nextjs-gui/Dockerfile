# Use Node.js LTS version as base
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the default Next.js port
EXPOSE 3000

# Start Next.js in development mode
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
