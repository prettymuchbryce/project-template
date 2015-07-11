var less = require('gulp-less');
var uglify = require('gulp-uglify');
var path = require('path');
var gulp = require('gulp'); 
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var scripts = [
    './client/vendor/q/q.js',
    './client/vendor/lodash/lodash.js',
    './client/vendor/jquery/dist/jquery.js',
    './client/vendor/jquery-cookie/jquery.cookie.js',
    './static/js/browserify-scripts.js'
];

gulp.task('delete-static', function() {
    return gulp.src('./static/', { read: false }) // much faster
        .pipe(rimraf());
});

gulp.task('create-static', ['delete-static'], function(callback) {
    return mkdirp('./static/js', function(error) {
        callback();
    });
});

gulp.task('css', ['clean', 'less'], function() {
    return gulp.src(['./client/vendor/bootstrap/dist/css/bootstrap.min.css', './client/vendor/hint.css/hint.css', './static/main.css'])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./static/'));
});

gulp.task('less', ['clean'], function () {
    return gulp.src('./client/less/**/*.less')
    .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./static/'));
});

gulp.task('scripts', ['browserify'], function() {
    return gulp.src(scripts)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./static/js/'));
});

gulp.task('scripts-prod', ['browserify'], function() {
    return gulp.src(scripts)
        .pipe(concat('all.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./static/js/'));    
});

gulp.task('images', ['clean'], function() {
    return gulp.src('./client/img/**/*')
    .pipe(gulp.dest('./static/img/'));    
});

gulp.task('browserify', ['clean'], function(cb) {
   return exec('browserify -t reactify -e ./client/src/app.js -o ./static/js/browserify-scripts.js', function(error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(error);
    });
});

gulp.task('server', ['build'], function() {
    var server = spawn('node', ['server/app.js']);

    server.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    server.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    server.on('exit', function (code) {
        console.log('server exited with code ' + code);
    });

    return server
});

gulp.task('clean', ['delete-static', 'create-static']);

gulp.task('build', ['clean', 'images', 'browserify', 'scripts', 'less', 'css']);

gulp.task('prod', ['clean', 'images', 'browserify', 'scripts-prod', 'less', 'css']);

gulp.task('watch', ['build'], function() {
    gulp.watch(['./client/**/*'], ['build'])
});

gulp.task('default', ['build', 'server']);