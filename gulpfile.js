const gulp = require("gulp")
const htmlmin = require('gulp-htmlmin')
const concat = require('gulp-concat')
const terser = require('gulp-terser')
const cleanCSS = require('gulp-clean-css')
const clean = require("gulp-clean")
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
// const imgMin = require("gulp-imagemin")

// import gulp from gulp


const html = () => {
    return gulp.src("./src/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist"))
}

const js = () => {
    return gulp.src("./src/**/*.js")
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(gulp.dest("./dist/js"))
}
// const css = () =>{
//     return gulp.src("./src/**/*.css")
//     .pipe(concat('all.css'))
//     
//     .pipe(gulp.dest("./dist/css"))
// }
const cleanDist = () => {
    return gulp.src("./dist", {read: false})
    .pipe(clean())
}

const scss = () => { 
    return gulp.src("./src/**/*.scss")
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat("all.css"))
    // .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest("./dist/css"))
}
const img = () => {
    return gulp.src('./src/**/*.+(png|jpg|svg|jpeg)')
		.pipe(gulp.dest('./dist/'))
}
// const img = () => {
//     return imgMin.src('src/img/**/*.{jpg,png,svg,gif,ico}').pipe(imagemin()).pipe(gulp.dest('dist/img'));
//   };
const dev = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch("./src/**/*", gulp.series(cleanDist, gulp.parallel(html, scss, js, img), (next) => {
        browserSync.reload()
        next()
    }))
    
}


gulp.task("scss", scss)
gulp.task("html", html)
gulp.task("js", js)
gulp.task("clean", cleanDist)
gulp.task("img", img)

gulp.task("build", gulp.series(cleanDist, gulp.parallel(html, scss, js, img)))
gulp.task("dev", dev)