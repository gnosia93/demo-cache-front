#!/bin/sh


#
# 1. npm install 실행해서 필요한 패키지를 설치한다. 이때 package.json을 참조한다. 
# 2. config 디렉토리에 .env.prod 파일안에 
#    API_ENDPOINT="http://cache-webap-h6b4tksk01sb-1174493446.ap-northeast-1.elb.amazonaws.com:8080/"
#    값을 수정한다. 
# 3. cross-env 를 이용하여 node.js 를 실행한다.

export APP_HOME=/home/ec2-user/demo-cache-front

npm install
sudo nohup cross-env NODE_ENV=prod node index.js > $APP_HOME/node.log 2>&1 &
