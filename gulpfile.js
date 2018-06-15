'use strict';
const gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    notify = require('gulp-notify');

gulp.task('default', () => {
    livereload.listen();
    nodemon({
        script: 'index.js',
        args: ['mocks/Sales-1.json'],
        ignore: ['node_modules/**']
    })
    .on('log', (event) => {
        console.log(event.colour);
    })
    .on('restart', () => {
        gulp.src('app.js')
            .pipe(livereload())
            .pipe(notify('Reloading page, please wait...'));
    });
});