FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .

COPY yarn.lock .

RUN yarn

RUN npm install -g nodemon

COPY . .