FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_BOT_USERNAME
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BOT_USERNAME=${VITE_BOT_USERNAME}
RUN echo "$VITE_API_URL" >> .env
RUN echo "$VITE_BOT_USERNAME" >> .env

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
