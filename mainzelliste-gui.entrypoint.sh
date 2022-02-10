#!/usr/bin/env bash
envsubst < /usr/share/nginx/html/assets/config/config.template.json > /usr/share/nginx/html/assets/config/config.json
# Deployment context muss laut angular docu form /my/app/ haben
if [ -n "$NGINX_DEPLOYMENT_CONTEXT" ]; then
  echo "Adjusting apps base href to: ${NGINX_DEPLOYMENT_CONTEXT}";
  sed -i -e 's|<base href="/">|<base href='/"$NGINX_DEPLOYMENT_CONTEXT"/'>|' index.html;
fi
