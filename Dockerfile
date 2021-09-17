FROM node:12.21.0

WORKDIR /app

RUN git clone https://github.com/vishnubob/wait-for-it.git

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start:prod"]