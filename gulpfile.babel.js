const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync');
const named = require('vinyl-named');
const webpack = require('webpack-stream');
const { data } = require('json-file').read('./package.json');
const webpackconfig = require('./webpack.config.js');

function getMainHeader() {
    return `/*!
 * Name    : ${data.title}
 * Version : ${data.version}
 * Author  : ${data.author}
 * GitHub  : ${data.homepage}
 */
`;
}

/**
 * Error Handler for gulp-plumber
 */
function errorHandler(err) {
    console.error(err);
    this.emit('end');
}

/**
 * Clean Task
 */
gulp.task('clean', () => del(['dist']));

/**
 * JS Task
 */
gulp.task('js', () => (
    gulp.src(['src/*.js', '!src/*.esm.js'])
        .pipe($.plumber({ errorHandler }))
        .pipe(named())
        .pipe(webpack({
            config: webpackconfig,
        }))
        .pipe($.header(getMainHeader()))
        .pipe(gulp.dest('dist'))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglify({
            output: {
                comments: /^!/,
            },
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
));


/**
 * BrowserSync Task
 */
gulp.task('browser_sync', (cb) => {
    browserSync.init({
        server: {
            baseDir: ['demo', './'],
        },
    });

    cb();
});

/**
 * Build (default) Task
 */
gulp.task('build', gulp.series('clean', 'js'));

/**
 * Watch Task
 */
gulp.task('dev', gulp.series('build', 'browser_sync', () => {
    gulp.watch('src/*.js', gulp.series('js'));
}));

gulp.task('default', gulp.series('build'));
