# Multi Stage Docker is where you have both the production and the dev in the same file
# Staging part is where the build is taking place
FROM node:alpine AS buildStage
WORKDIR /usr/src/app
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY . .
RUN yarn
RUN npm install -g nodemon
RUN yarn build

# Final Build is where the dist files are downloaded
# This is better because every line counts as a layer and we want to be minimal
FROM node:alpine
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY --from=buildStage /usr/src/app/dist ./dist