FROM ubuntu:latest
USER root
WORKDIR /home/app
COPY ./package.json /home/app/package.json
RUN apt-get update ; apt-get -y upgrade
RUN apt-get -y install curl gnupg make g++ python udev tzdata
RUN curl -fsSL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm

RUN npm install

COPY . .

RUN npm install
RUN npm run build

RUN chmod +x /home/app/startup.sh

ENTRYPOINT ["bash", "/home/app/startup.sh"]
