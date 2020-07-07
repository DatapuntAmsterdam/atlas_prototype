#!/bin/sh
basePath=/usr/share/nginx/html
fileName=${basePath}/index.html
envsubst < ${fileName} > ${basePath}/index.env.html
nginx -g 'daemon off;'
