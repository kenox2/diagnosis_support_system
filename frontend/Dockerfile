FROM node:24.4-bullseye AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN REACT_APP_API_URL=http://16.171.234.51:8080 npm run build


FROM nginx:stable-alpine3.21 AS prod

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
