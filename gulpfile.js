const gulp = require('gulp');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');

/* ----------------------------------------- */
/*  Compile LESS
/* ----------------------------------------- */

function compileLESS() {
    return gulp.src("less/black-flag.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./css/"))
}
const css = gulp.series(compileLESS);

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
    gulp.watch(["less/*.less"], css);
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(
    gulp.parallel(css),
    watchUpdates
);
exports.css = css;
