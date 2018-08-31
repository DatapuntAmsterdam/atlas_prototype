#!/bin/bash

./node_modules/.bin/cypress open --env \
"API_ROOT=$API_ROOT,"\
"USERNAME_EMPLOYEE_PLUS=$USERNAME_EMPLOYEE_PLUS,"\
"PASSWORD_EMPLOYEE_PLUS=$PASSWORD_EMPLOYEE_PLUS" \
--config integrationFolder="test/cypress/health"


