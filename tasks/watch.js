(function () {
    'use strict';

    const gulp = require('gulp');

    gulp.task(
        'watch',
        function () {
            gulp.watch('./app/**/*.js', ['js:build'])
        }
    );
})();