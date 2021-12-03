FROM node:lts as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx:1.21
COPY nginx.conf /etc/nginx/templates/mainzelliste-gui.nginx.conf.template
COPY --from=build /usr/src/app/dist/uebung /usr/share/nginx/html
