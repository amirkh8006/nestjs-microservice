FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Set NODE_ENV to production
ENV NODE_ENV=production

CMD ["node", "dist/apps/email-sender/main"]
