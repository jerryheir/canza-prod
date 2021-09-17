FROM node:12.21.0

WORKDIR /app

RUN apt-get update

RUN apt-get install \
    apt-transport-https \
    ca-certificates \
    software-properties-common \
    curl \
    gnupg \
    lsb-release

RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

RUN apt-key fingerprint 0EBFCD88

RUN add-apt-repository "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable"

RUN apt-get update

RUN apt-get install docker-ce docker-ce-cli containerd.io

RUN git clone https://github.com/vishnubob/wait-for-it.git

RUN curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

RUN chmod +x /usr/local/bin/docker-compose

RUN ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start:prod"]
