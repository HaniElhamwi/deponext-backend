FROM node:20-bookworm-slim

# Install system dependencies for sharp / @swc/core / Strapi
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libvips-dev \
  git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Strapi
ENV NODE_ENV=production
RUN pnpm build

EXPOSE 1337

CMD ["pnpm", "start"]
