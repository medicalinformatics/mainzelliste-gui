#!/usr/bin/env bash
if [ -d "/run/secrets" ]; then
  for file in "/run/secrets/"*; do
    echo "Found $file in /run/secrets";
    if test -f "$file"; then
      envName=$(echo "$file" | tr '[:lower:]' '[:upper:]' | sed -e "s|/RUN/SECRETS/||" -e "s|_SECRET||");
      echo "Exporting environment for $envName from $file";
      eval export "$envName"="$(cat $file)";
    fi
  done
fi

CONFIG_FILE=/usr/share/nginx/html/assets/config/config.template.json
if [ -f "/run/secrets/mainzelliste-gui.docker.conf" ]; then
    CONFIG_FILE=/run/secrets/mainzelliste-gui.docker.conf
fi
envsubst < $CONFIG_FILE > /usr/share/nginx/html/assets/config/config.json
