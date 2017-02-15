'use strict';

const availableStates = require('./helpers/available-states');
const validator = require('./validators/validator');

describe('each URL should load the corresponding view', function () {
    Object.keys(availableStates).forEach(key => {
        it(key, () => {
            const page = dp.navigate(key);

            validator(key, page);
        });
    });
});
