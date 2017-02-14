module.exports = function (state, page, expected) {
    dp.availableStates[state].validator(page, expected || dp.availableStates[state].expected);
};
