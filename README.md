# Mainzelliste Gui 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.3.

## Development server
1. copy the file `.env.default` to `.env`
2. Setup Keyclock 
3. ``docker-compose up mainzelliste mainzelliste-db keycloak keycloak-db``
4. Run `ng serve --port=80` for a dev server. Navigate to `http://localhost`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

### Angular Project
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Docker Image
``docker build -t medicalinformatics/mainzelliste-gui:develop .``

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Setup keycloak
1. create new realm **mainzelliste**
   1. go to tab **General** and set **Html display name**: `<div class="kc-logo-text"><span></span></div>`
   2. go to tab **Themes** and choose login theme mainzelliste
2. create new client **mainzelliste-ui**
   1. set "Root URL" and "Home URL" to `http://localhost`
   2. set "valid redirect URI", "valid post logout redirect URI" and "web origins" to `http://localhost/*`
   3. go to "Login Setting" and select mainzelliste as **Login theme**
3. create default new user for demo
   1. go to Credentials tab and add password

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
