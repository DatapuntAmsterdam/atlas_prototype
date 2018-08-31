#!/bin/bash

# Often runs out of memory:
# ./node_modules/.bin/cypress run --env \
# "API_ROOT=$API_ROOT,"\
# "USERNAME_EMPLOYEE=$USERNAME_EMPLOYEE,"\
# "USERNAME_EMPLOYEE_PLUS=$USERNAME_EMPLOYEE_PLUS,"\
# "PASSWORD_EMPLOYEE=$PASSWORD_EMPLOYEE,"\
# "PASSWORD_EMPLOYEE_PLUS=$PASSWORD_EMPLOYEE_PLUS"

node ./scripts/cypress/cypress-run-isolated.js
