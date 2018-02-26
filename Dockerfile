# Build
FROM node:8.9 AS build-deps
MAINTAINER datapunt.ois@amsterdam.nl

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y \
      netcat \
      git && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json /app/

# Install all NPM dependencies. Also:
#  * Changing git URL because network is blocking git protocol...
#  * Uninstall cypress because it is not used here and installation is sluggish
#    Note: uninstall actually performs an installation as well (NPM magic)
RUN git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com: && \
    npm --production=false \
        --unsafe-perm \
        --verbose \
        uninstall cypress  && \
    npm cache clean --force

# Build dependencies
COPY src /app/src
COPY modules /app/modules
COPY grunt /app/grunt
COPY public /app/public
COPY scripts /app/scripts
COPY .babelrc \
      403-geen-toegang.html \
      Gruntfile.js \
      index.html \
      webpack.* \
      index.ejs \
      favicon.png \
      /app/

ARG BUILD_ENV=prod
RUN npm run build-${BUILD_ENV}

# Test dependencies
COPY karma.conf.js \
      jest.config.js \
      /app/
COPY .storybook /app/.storybook
COPY test /app/test

# Web server image
FROM nginx:1.12.2-alpine
COPY --from=build-deps /app/dist /usr/share/nginx/html
