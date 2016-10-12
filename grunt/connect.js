module.exports = {
    build: {
        options: {
            base: 'build',
            open: true,
            middleware: function (connect, options, middlewares) {
                middlewares.unshift(require('connect-livereload')());

                return middlewares;
            }
        }
    }
};
