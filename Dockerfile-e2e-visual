# Build
FROM node:8.9 AS build-deps
MAINTAINER datapunt.ois@amsterdam.nl

ENV NODE_ENV=production

WORKDIR /app

# Cleanup apt-get packages
RUN apt-get update && \
  apt-get upgrade -y --no-install-recommends && \
  apt-get install -y git nginx \
    gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \
    libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
    libappindicator1 libnss3 lsb-release xdg-utils \
    xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 && \
  rm -rf /var/lib/apt/lists/*

# Install sluggish packages ahead of time
RUN npm install cypress phantomjs-prebuilt && \
    npm cache clean --force

COPY package.json package-lock.json /app/

# Changing git URL because network is blocking git protocol...
RUN git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com: && \
    npm --production=false \
        --unsafe-perm \
        --verbose \
        install  && \
    npm cache clean --force

# TODO merge with other apt-get install packages
RUN apt-get update && apt-get install -y netcat

COPY src /app/src
COPY modules /app/modules
COPY grunt /app/grunt
COPY public /app/public
COPY cypress.json \
      .babelrc \
      403-geen-toegang.html \
      karma.conf.js \
      jest.config.js \
      Gruntfile.js \
      index.html \
      webpack.* \
      index.ejs \
      favicon.png \
      /app/

ENV NODE_ENV=production
ARG BUILD_ENV=prod
RUN npm run build-${BUILD_ENV}

COPY scripts /app/scripts
COPY test /app/test
COPY .storybook /app/.storybook
COPY jest.visual.config.js \
      /app/

# Web server image
FROM nginx:1.12.2-alpine
COPY --from=build-deps /app/dist /usr/share/nginx/html
