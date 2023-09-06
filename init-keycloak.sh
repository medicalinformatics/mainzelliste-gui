#!/bin/bash
# 1. argument $1 : mainzelliste ui url

docker compose up -d keycloak-db
sleep 2
for i in $(seq -s ' ' 20); do
  if [ "$( docker container inspect -f '{{.State.Status}}' mainzelliste-gui-keycloak-db-1 )" = "running" ]; then
    if [ -n "$1" ]; then
        echo "init keycloak db and replace ui url with: " "$1"
        sed -e 's/localhost/'"$1"'/g' dump.sql | docker exec -i  mainzelliste-gui-keycloak-db-1 psql -U admin -d postgres
    else
        echo "init keycloak db with the default ui value: localhost"
        docker exec -i  mainzelliste-gui-keycloak-db-1 psql -U admin -d postgres
    fi;
    break
  else
      echo "keycloak db container not , retrying in 1 second"
      sleep 1
  fi;
done;
