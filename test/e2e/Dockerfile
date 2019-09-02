FROM cypress/base:10.16.0
RUN apt-get update && \
    apt-get install -y \
      netcat && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home

COPY asound.conf /etc/asound.conf
COPY package.json yarn.lock  /home/

# Install all NPM dependencies, and:
#  * Setting `CI=true` to stop cypress install progress from flooding the CI log
RUN npm config set registry https://nexus.data.amsterdam.nl/repository/npm-group/ && \
    CI=true yarn && \
    yarn cache clean

COPY . /home/
