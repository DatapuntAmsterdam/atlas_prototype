# Build
FROM node:12 AS build-deps
LABEL maintainer="datapunt@amsterdam.nl"

WORKDIR /app

COPY package.json package-lock.json .env.* /app/
COPY sitemap-generator /app/sitemap-generator
COPY public /app/public


# Install all NPM dependencies, and:
#  * Changing git URL because network is blocking git protocol...
RUN git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com: && \
    #    npm config set registry https://nexus.data.amsterdam.nl/repository/npm-group/ && \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    npm --production=false \
    --unsafe-perm \
    --verbose \
    ci

RUN npm run generate:sitemap

# Build dependencies
COPY src /app/src
COPY modules /app/modules
COPY .babelrc \
    .eslintrc.js \
    .eslintignore \
    .prettierrc \
    .prettierignore \
    index.ejs \
    webpack.* \
    tsconfig.json \
    tsconfig.webpack.json \
    favicon.png \
    /app/

RUN npm run build
RUN echo "build= `date`" > /app/dist/version.txt

# Test dependencies
COPY karma.conf.ts \
    jest.config.js \
    /app/
COPY test /app/test

# Web server image
FROM nginx:1.19-alpine
COPY scripts/startup.sh startup.sh
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/
COPY --from=build-deps /app/dist /usr/share/nginx/html

CMD sh startup.sh
