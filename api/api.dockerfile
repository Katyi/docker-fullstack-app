FROM node:20

WORKDIR /app

COPY api/package*.json ./

RUN npm install

COPY ./.env ./.env

COPY api/prisma ./prisma

RUN npx prisma generate

COPY api/. .

EXPOSE 4000

CMD ["node", "index.js"]