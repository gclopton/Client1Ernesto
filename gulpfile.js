var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concatScripts = require('gulp-concat');
var merge= require('merge-stream');
var prettify = require('gulp-jsbeautifier');

//########################################################################################
//gulp concatScripts
//Dev-Dependencies: Browserify
//Status: Working
//#######################################################################################
gulp.task('concatScripts', function(){
    return gulp.src(['src/js/bootstrap.min.js','src/js/jquery.min.js','src/js/main.js','src/js/mustache.min.js'])
        .pipe(concatScripts('concatenated.js'))
        .pipe(browserify())
        .pipe(gulp.dest('src/js'));
});
//##############################################################################
//Gulp Sass
//Task Dependencies:ConcatScripts
//Dev-Dependencies: Autoprefixer
//Status: Working
//###############################################################################
//AutoPrefixer:Takes all sass files from the src/scss folder and adds browser prefixes to them
gulp.task('sass', function () {
    var bootstrapCSS = gulp.src('node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;

    sassFiles = gulp.src('src/scss/style.scss')
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

    return merge(sassFiles, bootstrapCSS)
        .pipe(concatScripts('compiled.css'))
        .pipe(gulp.dest('src/css'));
});
//You have the option of changing expanded to compressed. This will compress your css file. Other options are nested and compact.
//####################################################################################################################################
//browser-sync: takes all css, html, and js files from the app/css, app, and app/js folders respectively and loads them in the local serer
//Important! The html file that you want browser-sync to serve must be called index.html
//####################################################################################################################################
gulp.task('serve', ['sass'], function () {
    browserSync.init(['src/css/*.css', 'src/*.html', 'src/js/*.js'], {
        server: {
            baseDir: 'src'
        }
    })
});
//################################################################################################
//Watches all sass files in the src/scss for changes and loads them the to local server
//################################################################################################
gulp.task('watch', ['serve', 'sass','concatScripts'], function () {
    gulp.watch(['src/scss/*.scss'], ['sass']);
});
gulp.task('default', ['watch']);
//########################################################################################
