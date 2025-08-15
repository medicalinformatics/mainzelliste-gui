#!/bin/bash
# 1. argument $1 : mainzelliste ui url
# 1. argument $2 : protocol 'http' or 'https'
protocol="http"
if [ -z "$2" ]; then
  echo "no protocol argument provided. the default protocol is 'http'"
else
  if [ "$2" == "https" -o "$2" == "http" ]; then
    protocol=$2
  else
   echo "invalid protocol "$2
  fi;
fi;

if [ -n "$1" ]; then
  echo "replace host with " "$1" " in the realm initialization file"
  sed -i 's/http:\/\/localhost:4200/'"$protocol"':\/\/'"$1"'/g' ./resources/keycloak/import/mainzelliste-realm.json
else
  echo "no host argument provided. the default host is 'localhost:4200'"
fi;
