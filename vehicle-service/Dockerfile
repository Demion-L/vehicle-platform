FROM node:20-alpine

WORKDIR /app

# Copy only package files first (for caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Nest.js app
RUN yarn build

EXPOSE 4001

# Start the service in dev mode
CMD ["yarn", "start:dev"]
