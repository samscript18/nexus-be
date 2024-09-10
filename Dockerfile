FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json .

RUN npm install -g npm@10.8.3

COPY . .

RUN npm install -g @nestjs/cli 

RUN npm run build

EXPOSE 4000

CMD [ "npm", "run", "start:prod" ]