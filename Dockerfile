FROM node:8.8

MAINTAINER datapunt.ois@amsterdam.nl

EXPOSE 80

ENV NODE_ENV=production

ARG PASSWORD_EMPLOYEE
ARG PASSWORD_EMPLOYEE_PLUS
ENV USERNAME_EMPLOYEE=atlas.employee@amsterdam.nl
ENV USERNAME_EMPLOYEE_PLUS=atlas.employee.plus@amsterdam.nl

RUN apt-get update \
  && apt-get upgrade -y --no-install-recommends \
  && apt-get install -y git nginx xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 \
  && rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app

ENV PATH=./node_modules/.bin/:~/node_modules/.bin/:$PATH
RUN git config --global url.https://.insteadOf git:// && \
  git config --global url."https://github.com/".insteadOf git@github.com: && \
  npm --production=false --unsafe-perm install && \
  chmod -R u+x node_modules/.bin/

ARG BUILD_ENV=prod
ARG BUILD_ID

RUN npm run build-${BUILD_ENV} -- --env.buildId=${BUILD_ID} \
  && cp -r /app/dist/. /var/www/html/

RUN npm run test-e2e

COPY default.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/sites-enabled/default

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["nginx", "-g", "daemon off;"]
