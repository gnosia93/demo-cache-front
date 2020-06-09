FROM node

MAINTAINER soonbeom@amazon.com

#RUN yum update
#RUN yum install -y nginx

ENV PATH="/usr/local/bin:${PATH}"

ADD . /app
EXPOSE 8080 3000
WORKDIR /app

RUN npm --global config set user root && \
    npm --global install cross-env

CMD ["cross-env", "NODE_ENV=prod", "node", "index.js"]
# CMD ["node", "index.js"]
