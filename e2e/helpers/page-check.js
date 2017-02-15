'use strict';

module.exports = function (actual, expected) {
    Object.keys(expected).forEach(key => {
        if (expected[key] instanceof RegExp) {    // Regular expression
            expect(actual[key]).toMatch(expected[key]);
        } else {                                    // string, number, boolean
            expect(actual[key]).toBe(expected[key]);
        }
    });
};
