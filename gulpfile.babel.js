import autoprefixer from "gulp-autoprefixer";
import babel from "gulp-babel";
import browserSync from "browser-sync";
import gulp from "gulp";
import jadePhp from "gulp-jade-php";
import plumber from "gulp-plumber";
import sass from "gulp-sass";
import uglify from "gulp-uglify";

const dirs = {
   src: "src",
   dest: "build"
};

const templatePaths = {
   src: `${dirs.src}/jade/*.jade`,
   dest: `${dirs.dest}`
};

const sassPaths = {
   src: `${dirs.src}/styles/styles.scss`,
   dest: `${dirs.dest}/`
};

const jsPaths = {
   src: `${dirs.src}/js/main.js`,
   dest: `${dirs.dest}`
};

gulp.task("templates", () => {
   return gulp
      .src(templatePaths.src)
      .pipe(plumber())
      .pipe(jadePhp({ pretty: true }))
      .pipe(gulp.dest(templatePaths.dest))
      .pipe(browserSync.reload({ stream: true }));
});

gulp.task("sass", () => {
   return gulp
      .src(sassPaths.src)
      .pipe(plumber())
      .pipe(
         sass({
            // use "compressed" for production
            outputStyle: "expanded",
            // for debugging, show line where style is applied.
            sourceComments: true
         }).on("error", sass.logError)
      )
      .pipe(
         autoprefixer({
            grid: "no-autoplace"
         })
      )
      .pipe(gulp.dest(sassPaths.dest))
      .pipe(browserSync.reload({ stream: true }));
});

gulp.task("js", () => {
   return gulp
      .src(jsPaths.src)
      .pipe(plumber())
      .pipe(babel())
      .pipe(
         uglify({
            // return compressor warnings in result.warnings
            // Use the value "verbose" for more detailed warnings.
            warnings: true,
            // enable/disable top level variable and function name mangling & drop unused variables and functions.
            toplevel: false
         })
      )
      .pipe(gulp.dest(jsPaths.dest))
      .pipe(browserSync.reload({ stream: true }));
});

// watch root for changes, run all tasks and reload
gulp.task(
   "default",
   gulp.parallel(["templates", "sass", "js"], function() {
      browserSync({
         server: {
            baseDir: "./build/"
         }
      });

      gulp.watch(templatePaths.src, gulp.series("templates"));
      gulp.watch(sassPaths.src, gulp.series("sass"));
      gulp.watch(jsPaths.src, gulp.series("js"));
   })
);
