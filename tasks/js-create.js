(function () {
    'use strict';

    const gulp = require('gulp');
    const browserify = require('browserify');
    const babelify = require('babelify');
    const source = require('vinyl-source-stream');
    const gutil = require('gulp-util');

    const dependencies = [
        'react',
        'react-dom'
    ];
    let scriptsCount = 0;

    let bundleApp = function (isProduction) {
        scriptsCount = scriptsCount + 1;
        let destination = isProduction ? 'dist' : 'build';

        const appBundler = browserify({
            entries: './app/js/app.js',
            debug: true
        });

        if (!isProduction && scriptsCount === 1) {
            browserify({
                require: dependencies,
                debug: true
            })
                .bundle()
                .on('error', gutil.log)
                .pipe(source('vendor.js'))
                .pipe(gulp.dest(`./${destination}/js/`));
        }

        if (!isProduction) {
            dependencies.forEach(function (dep) {
                appBundler.external(dep);
            })
        }

        appBundler
            .transform('babelify', {
                presets: ['es2015', 'react']
            })
            .bundle()
            .on('error', gutil.log)
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(`./${destination}/js/`));
    };

    gulp.task(
        'js:simple',
        function () {
            browserify({
                entries: './app/js/app.js',
                debug: true
            })
                .transform(babelify, {
                    presets: ['es2015']
                })
                .on('error', gutil.log)
                .bundle()
                .on('error', gutil.log)
                .pipe(source('bundle.js'))
                .pipe(gulp.dest('./build/js'));
        }
    );

    gulp.task(
        'js:build',
        function () {
            bundleApp(false);
        }
    );

    gulp.task(
        'js:dist',
        function () {
            bundleApp(true);
        }
    );
})();