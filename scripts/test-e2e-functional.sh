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

# Requires the following environment variables to be set:
# CYPRESS_baseUrl

PATH=./node_modules/.bin/:$PATH
cypress run \
  --env USERNAME_EMPLOYEE=$USERNAME_EMPLOYEE,USERNAME_EMPLOYEE_PLUS=$USERNAME_EMPLOYEE_PLUS,PASSWORD_EMPLOYEE=$PASSWORD_EMPLOYEE,PASSWORD_EMPLOYEE_PLUS=$PASSWORD_EMPLOYEE_PLUS
