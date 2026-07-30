# ============================================================
# DOCKERFILE
# Tells Back4app exactly how to build and run this backend.
# ============================================================

FROM node:20-alpine

WORKDIR /app

# Copy only package files first — Docker caches this layer, so
# rebuilds are faster when you haven't changed dependencies.
COPY package*.json ./
RUN npm install --production

# Now copy the rest of your actual code
COPY . .

# Back4app assigns its own port at runtime via the PORT env var —
# your server.js already reads process.env.PORT, so this just
# documents which port the container listens on.
EXPOSE 3000

CMD ["npm", "run", "start"]