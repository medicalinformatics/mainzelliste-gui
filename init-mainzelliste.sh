#!/bin/bash
# 1. argument $1 : mainzelliste ui url

docker compose up -d mainzelliste-db
sleep 2
for i in $(seq -s ' ' 20); do
  if [ "$( docker container inspect -f '{{.State.Status}}' mainzelliste-gui-mainzelliste-db-1 )" = "running" ]; then
      echo "init. mainzelliste db with 100k patient"
      cat ./resources/mainzelliste.sql | docker exec -i  mainzelliste-gui-mainzelliste-db-1 psql -U mainzelliste -d mainzelliste
      #docker compose down
      break
  else
      echo "mainzelliste db container not running, retrying in 1 second"
      sleep 1
  fi;
done;
