FROM node:16.14.0-alpine3.14 as build-stage
WORKDIR /app
ENV VITE_MIDDLEWARE_URL='https://middleware-api.invest4nature.digital-enabler.eng.it'
COPY app/package*.json ./

RUN npm install
COPY app ./
RUN npm run build

FROM 237944624957.dkr.ecr.eu-south-1.amazonaws.com/nginx:stable-alpine as production-stage
COPY /default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]