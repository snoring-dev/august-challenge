FROM node:18-alpine

WORKDIR /usr/daily-french-app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]