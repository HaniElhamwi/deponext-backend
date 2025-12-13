FROM node:20-bookworm-slim

# Install system dependencies for sharp / @swc/core / Strapi
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libvips-dev \
  git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy source code
COPY . .

# Build Strapi
ENV NODE_ENV=production
RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
