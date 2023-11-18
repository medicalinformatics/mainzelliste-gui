#!/bin/bash
# 1. argument $1 : mainzelliste ui url

if [ -n "$1" ]; then
  echo "replace ui url with " "$1" " in the realm initialization file"
  sed -i 's/localhost:4200/'"$1"'/g' ./resources/keycloak/import/mainzelliste-realm.json
else
  echo "no argument provides. the default ui url is 'localhost:4200'"
fi;
