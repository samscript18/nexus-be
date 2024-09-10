FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json .

RUN npm install 

COPY . .

RUN npm install -g @nestjs/cli 

RUN npm run build

EXPOSE 4000

CMD [ "npm", "run", "start:prod" ]