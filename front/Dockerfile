FROM node as vite-app

WORKDIR /app/client
COPY . .

ARG VITE_API_BASE_URL
ARG VITE_CAT_API_KEY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_CAT_API_KEY=${VITE_CAT_API_KEY}

RUN npm ci
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/

RUN rm -rf html && mkdir html

WORKDIR /

COPY ./nginx.conf /etc/nginx
COPY --from=vite-app ./app/client/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
