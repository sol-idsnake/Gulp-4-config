import autoprefixer from "autoprefixer";
import babel from "gulp-babel";
import browsersync from "browser-sync";
import cleanCSS from "gulp-clean-css";
import gulp from "gulp";
import jade from "gulp-jade-php";
import newer from "gulp-newer";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import postCSS from "gulp-postcss";
import sass from "gulp-sass";
import uglify from "gulp-uglify";

const browserSync = browsersync.create();

const dirs = {
  dest: "./build",
  src: "./src",
};

gulp.task("templates", () =>
  gulp
    .src(`${dirs.src}/jade/*.jade`)
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(newer("./"))
    .pipe(gulp.dest("./"))
    .pipe(browserSync.stream())
);

gulp.task("css", (callback) => {
  gulp.series(["sass", "minifycss"])(callback);
});

gulp.task("sass", () =>
  gulp
    .src(`${dirs.src}/styles/styles.scss`, { sourcemaps: true })
    .pipe(plumber())
    .pipe(
      sass({
        // use "compressed" for production
        outputStyle: "expanded",
        // for debugging, show line where style is applied.
        sourceComments: true,
      }).on("error", sass.logError)
    )
    .pipe(postCSS([autoprefixer({ grid: "autoplace" })]))
    .pipe(gulp.dest(`${dirs.dest}/css/`, { sourcemaps: true }))
    .pipe(browserSync.stream())
);

gulp.task("minifycss", () =>
  gulp
    .src(`${dirs.dest}/css/styles.css`, { sourcemaps: true })
    .pipe(plumber())
    .pipe(cleanCSS({ compatibility: "*" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(`${dirs.dest}/css`, { sourcemaps: "." }))
    .pipe(browserSync.stream())
);

gulp.task("js", () =>
  gulp
    .src(`${dirs.src}/js/main.js`)
    .pipe(plumber())
    .pipe(babel())
    .pipe(
      uglify({
        // return compressor warnings in result.warnings
        // Use the value "verbose" for more detailed warnings.
        warnings: true,
        // enable/disable top level variable and function name mangling & drop unused variables and functions.
        toplevel: false,
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(`${dirs.dest}/js`))
    .pipe(browserSync.stream())
);

// watch root for changes, run all tasks and reload
gulp.task("default", () => {
  browserSync.init();

  gulp.watch(`${dirs.src}/js/*.js`, gulp.series("js"));
  gulp.watch(`${dirs.src}/styles/*.scss`, gulp.series("css"));
  gulp.watch(`${dirs.src}/jade/*.jade`, gulp.series("templates"));
});
