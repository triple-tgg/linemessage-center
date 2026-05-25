FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@latest  || true
RUN npm install

COPY . .

RUN npm run build

EXPOSE 80

CMD [ "node", "dist/main.js" ]