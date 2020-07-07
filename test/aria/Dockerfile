FROM node:12

RUN apt-get update && \
    apt-get install -y \
      netcat gconf-service libasound2 libatk1.0-0 \
      libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \
      libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
      libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
      libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
      libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
      libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
      ca-certificates fonts-liberation libappindicator1 libnss3 \
      lsb-release xdg-utils && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home

COPY .babelrc package.json package-lock.json ./

# Install all NPM dependencies, and:
#  * Changing git URL because network is blocking git protocol...
RUN git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com: && \
    npm config set registry https://nexus.data.amsterdam.nl/repository/npm-group/ && \
    npm --production=false \
        --unsafe-perm \
        --no-audit \
        install && \
    npm cache clean --force

COPY run.sh ./
COPY test ./test
