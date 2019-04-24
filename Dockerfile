FROM node:9

#RUN apt-get update
# Basics
# Basics

#RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
#RUN apt-get install -y nodejs

WORKDIR /srv
COPY server-side/site/package.json /srv

RUN npm install
COPY . /srv

RUN export MONGO_PORT=27017
RUN export MONGO_IP=127.0.0.1
RUN export MONGO_USER=myUserAdmin
RUN export MONGO_PASSWORD=abc123
RUN export MAIL_USER=csc519s19.rshu
RUN export MAIL_PASSWORD=devops2019!
RUN export MAIL_SMTP=smtp.gmail.com
RUN export APP_PORT=3002

EXPOSE 3002
#WORKDIR server-side/site/
CMD cd server-side/site/ && node server.js
