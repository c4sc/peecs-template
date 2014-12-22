var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefix = require('gulp-autoprefixer'),
    notify = require("gulp-notify"),
    bower = require('gulp-bower'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    http = require('http'),
    st = require('st'),
    livereload = require('gulp-livereload');

var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components',
};

gulp.task('bower', function() {
    return bower().pipe(gulp.dest(config.bowerDir));
});

gulp.task('icons', function() {
    gulp.src(config.bowerDir + '/fontawesome/fonts/**.*').pipe(gulp.dest('./public/fonts'));
    return gulp.src(config.bowerDir + '/bootstrap-sass-official/assets/fonts/bootstrap/**.*').pipe(gulp.dest('./public/fonts/bootstrap'));
});

gulp.task('css', function() {
    return gulp.src(config.sassPath + '/style.sass')
        .pipe(
            sass({
                "sourcemap=none": true,
                style: 'compressed',
                loadPath: [
                    './resources/sass',
                    config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                    config.bowerDir + '/fontawesome/scss',
                ]
            })
            .on("error", notify.onError(function(error) {
                return "Error: " + error.message;
            }))
        )
        .pipe(autoprefix('last 2 version'))
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});

gulp.task('compress', function() {
    /*
    gulp.src(config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.js')
            */
    gulp.src([
            config.bowerDir + '/jquery/dist/jquery.js',
            config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.js',
            config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js'
        ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', ['server'], function() {
    livereload.listen({ basePath: 'public' });
    gulp.watch([config.sassPath + '/**/*.scss', config.sassPath + '/**/*.sass'], ['css']);
});

gulp.task('server', function(done) {
    http.createServer(
        st({ path: __dirname + '/public', index: 'index.html', cache: false })
    ).listen(9000, done);
});

gulp.task('default', ['bower', 'icons', 'css', 'compress']);
