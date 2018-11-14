#!/usr/bin/env bash

set -u
set -e
set -x

echo Building $1

echo Build distribution of this branch
export NODE_ENV=test

rm -rf node_modules
# No need to install Cypress for it is not being used here
CYPRESS_INSTALL_BINARY=0 npm install
npm run build-test

echo Publish distribution in web-dir
OUTDIR=/var/www/html/atlas/builds/$1
if [ ! -d ${OUTDIR} ];
	then mkdir -p ${OUTDIR};
fi
rm -rf ${OUTDIR}/*
cp -r dist/* ${OUTDIR}

echo Generate new index.html for all branches
echo '<h1>atlas links</h1>' > /var/www/html/atlas/index.html
echo "<h2>Generated at `date`</h2>" >> /var/www/html/atlas/index.html
find /var/www/html/atlas -name index.html -printf "%T+\t%p\n" | sort -r | grep 'atlas' | sed 's/^.*\/atlas/\/atlas/' | sed 's/\/index.html//' | sed 's/^.*$/<p><a href="\0">\0<\/a><p>/' >> /var/www/html/atlas/index.html
echo Done
