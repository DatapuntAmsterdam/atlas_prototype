# Build
FROM node:10.10 AS build-deps
LABEL maintainer="datapunt@amsterdam.nl"

WORKDIR /app

COPY package.json package-lock.json /app/

# Install all NPM dependencies, and:
#  * Changing git URL because network is blocking git protocol...
RUN git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com: && \
    npm config set registry https://nexus.data.amsterdam.nl/repository/npm-group/ && \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    yarn --production=false \
        --unsafe-perm \
        --verbose \
        install && \
    yarn cache clean

# Build dependencies
COPY src /app/src
COPY modules /app/modules
COPY public /app/public
COPY scripts /app/scripts
COPY .babelrc \
     .eslintrc.js \
     .eslintignore \
     .prettierrc \
     .prettierignore \
      webpack.* \
      index.ejs \
      favicon.png \
      /app/

ENV NODE_ENV=production
ARG BUILD_ENV=prod
RUN yarn build-${BUILD_ENV}
RUN echo "build= `date`" > /app/dist/version.txt

# Test dependencies
COPY karma.conf.js \
     jest.config.js \
     /app/
COPY test /app/test


# Web server image
FROM nginx:1.12.2-alpine
ARG BUILD_ENV=prod
COPY nginx-${BUILD_ENV}.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/
COPY --from=build-deps /app/dist /usr/share/nginx/html
