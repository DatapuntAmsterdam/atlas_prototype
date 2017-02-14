'use strict';

module.exports = function (actual, expected) {
    Object.keys(expected).forEach(key => {
        if (typeof expected[key] === 'object') {    // Regular expression
            expect(actual[key]).toMatch(expected[key]);
        } else {                                    // string, number, boolean
            expect(actual[key]).toBe(expected[key]);
        }
    });
};
