FROM cypress/base:10
RUN apt-get update && \
    apt-get install -y \
      netcat && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home

COPY asound.conf /etc/asound.conf
COPY package.json package-lock.json  /home/

# Install all NPM dependencies, and:
#  * Setting `CI=true` to stop cypress install progress from flooding the CI log
RUN npm config set registry https://repo.datapunt.amsterdam.nl/repository/npm-group/ && \
    CI=true npm ci && \
     npm cache clean --force

COPY . /home/
