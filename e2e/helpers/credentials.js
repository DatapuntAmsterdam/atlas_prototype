'use strict';

let credentials;
const ENV_VARIABLES = [
    'USERNAME_EMPLOYEE',
    'PASSWORD_EMPLOYEE',
    'USERNAME_EMPLOYEE_PLUS',
    'PASSWORD_EMPLOYEE_PLUS'
];

if (areEnvVariablesComplete()) {
    ENV_VARIABLES.forEach(envVariable => {
        credentials[envVariable] = process.env[envVariable];
    });
} else {
    credentials = require('../../grunt/config/credentials');
}

module.exports = credentials;

function areEnvVariablesComplete () {
    return ENV_VARIABLES.reduce((isComplete, variable) => {
        if (process.env[variable]) {
            return isComplete;
        } else {
            return false;
        }
    }, true);
}
