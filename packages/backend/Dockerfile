FROM node:14.18.1-alpine

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package.json /usr/src/api

RUN npm install -g npm@6.14.15
RUN npm install

COPY . /usr/src/api

CMD [ "npm", "run", "start:prod" ]