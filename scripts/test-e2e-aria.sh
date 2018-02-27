#!/bin/bash
set -u
set -e

# wait
NEXT_WAIT_TIME=0
until nc -z atlas 80 || [ $NEXT_WAIT_TIME -eq 10 ]
do
    echo "Waiting for Atlas server..."
    sleep $(( NEXT_WAIT_TIME++ ))
done

PATH=./node_modules/.bin/:$PATH
babel-node ./test/pa11y.js
