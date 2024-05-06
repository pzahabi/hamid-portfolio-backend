FROM node:lts-alpine as build
ENV NODE_ENV=default
WORKDIR /backendApp
COPY package*.json ./
RUN npm install && mv node_modules ../
COPY . .
EXPOSE 5000
RUN chown -R node /backendApp
CMD node index.js