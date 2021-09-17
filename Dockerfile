FROM node:12.21.0

RUN git clone https://github.com/vishnubob/wait-for-it.git

RUN sudo curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

RUN sudo chmod +x /usr/local/bin/docker-compose

RUN sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start:prod"]