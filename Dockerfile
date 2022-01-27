FROM node:lts as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY ./angular.json ./tsconfig.json ./tsconfig.app.json ./
COPY ./src ./src
RUN npm run build

FROM nginx:1.21
COPY nginx.conf /etc/nginx/templates/mainzelliste-gui.nginx.conf.template
COPY --from=build /usr/src/app/dist/mainzelliste-gui /usr/share/nginx/html
COPY ./mainzelliste-gui.entrypoint.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/mainzelliste-gui.entrypoint.sh
