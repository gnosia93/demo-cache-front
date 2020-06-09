#!/bin/sh

## code commit

git pull
git add *
git commit -m "no message"
git push


## build stage
docker build -t mbp-front .
docker tag mbp-font:latest 
docker tag mbp-front:latest 509076023497.dkr.ecr.ap-northeast-2.amazonaws.com/mbp-front:latest
docker images
`aws ecr get-login --no-include-email --region ap-northeast-2`
docker push 509076023497.dkr.ecr.ap-northeast-2.amazonaws.com/mbp-front:latest

## test stage


## deploy stage
#kubectl delete pod --all
kubectl delete -f k8s/mbp-front-rc.yaml
kubectl apply -f k8s/mbp-front-rc.yaml
kubectl get pod

