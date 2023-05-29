FROM node:18-alpine

ENV PORT 80

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn config set network-timeout 1000000 -g && \
    yarn install

COPY . .

EXPOSE 80

CMD ["node", "/app/entry-http.js"]