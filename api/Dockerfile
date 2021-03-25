FROM node:latest

RUN mkdir -p /usr/src/app/api
WORKDIR /usr/src/app/api

COPY package.json /usr/src/app/api/
COPY app.js /usr/src/app/api/

RUN npm install

ADD models /usr/src/app/api/models/

RUN npm build

CMD ["npm","start"]