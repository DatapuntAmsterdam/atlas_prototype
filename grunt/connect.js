module.exports = {
    build: {
        options: {
            base: 'build',
            open: false,
            middleware: function (connect, options, middlewares) {
                middlewares.unshift(require('connect-livereload')());

                return middlewares;
            }
        }
    }
};
