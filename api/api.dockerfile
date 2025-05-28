FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./.env ./.env

COPY api/prisma ./prisma

RUN npx prisma generate

RUN npx prisma migrate deploy

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]