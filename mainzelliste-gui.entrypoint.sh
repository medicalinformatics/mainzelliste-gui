#!/usr/bin/env bash
envsubst < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json
bash /docker-entrypoint.sh
