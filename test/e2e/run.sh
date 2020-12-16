#!/bin/bash
set -u
set -e

# wait
NEXT_WAIT_TIME=0
until nc -z acc.data.amsterdam.nl 80 || [ $NEXT_WAIT_TIME -eq 10 ]
do
    echo "Waiting for Atlas server..."
    sleep $(( NEXT_WAIT_TIME++ ))
done

# Requires the following environment variables to be set:
# CYPRESS_baseUrl

npm run start
