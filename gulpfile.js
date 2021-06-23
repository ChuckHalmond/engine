const gulp = require('gulp');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dist/js'));
});
/*
const nodeDependencies = [
    "node_modules/twgl.js/dist/4.x/twgl.js",
    "node_modules/requirejs/require.js"
];

gulp.task('node-to-lib', function() {
    const libFolder = "web/dist/lib/";

    return gulp.src(...nodeDependencies)
        .pipe(gulp.dest(libFolder));
});*/

/*gulp.task('dist', function() {
    return gulp.src('./src/gui/template/index.html')
        .pipe(gulp.dest('./dist/html/'));
});*/

/*gulp.task('sass', function () {
    return gulp.src('./layout/sass/*.sass')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'));
});*/