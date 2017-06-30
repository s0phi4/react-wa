//
// gulpfile for csos-website
// use either: gulp [dev|prod]
//

var autoprefixer = require("gulp-autoprefixer");
var babelify = require("babelify");
var browserify = require("browserify");
var buffer = require("vinyl-buffer");
var concatcss = require("gulp-concat-css");
var cssmin = require("gulp-cssmin");
var eslint = require("gulp-eslint");
var gulp = require("gulp");
var gutil = require("gulp-util");
var imagemin = require("gulp-imagemin");
var notify = require("gulp-notify");
var pngquant = require("imagemin-pngquant");
var rename = require("gulp-rename");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");
var watchify = require("watchify");
var lintFormatter = require("./shared/lint-formatter");

// exclude large files from babel
var babelIgnoreList = [
  "node_modules/**"
];

//
// development lint
//

var lintIgnoreList = [
  "**/*.js",
  "**/*.jsx",
  "!gulpfile.js",
  "!build/**"
];

gulp.task("lint-dev", function() {
  return gulp.src(lintIgnoreList).pipe(eslint({
    useEslintrc: true,
    baseConfig:{
      parser: "babel-eslint"
    }
  }))
  .pipe(eslint.result(function(result) {
    return lintFormatter(result);
  }))
});

//
// production eslint
//

gulp.task("lint-prod", function() {
  return gulp.src(lintIgnoreList).pipe(eslint({
    useEslintrc: true,
    baseConfig:{
      parser: "babel-eslint"
    }
  }))
  .pipe(eslint.failAfterError())
  .pipe(eslint.result(function(result) {
    return lintFormatter(result);
  }))
});

//
// css
//

gulp.task("css", function() {
  gulp.src("./css/**/*.css")
  .pipe(concatcss("react-wa.css"))
  .pipe(cssmin())
  .pipe(gulp.dest("./build"));
});

//
// video
//

gulp.task("video", function() {
  gulp.src("./video/*")
  .pipe(gulp.dest("./build/video"));
});

// html
gulp.task("html", function() {
  gulp.src("./index.html")
  .pipe(gulp.dest("./build/"));
});

//
// fonts
//

gulp.task("fonts", function() {
  gulp.src("./fonts/**/*")
  .pipe(gulp.dest("./build/fonts"));
});

//
// images
//

gulp.task("images", function() {
  gulp.src("images/**/*")
  .pipe(gulp.dest("./build/images"));
});

//
// compile errors
//

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit("end");
}

//
// source
//

function buildScript(file, watch) {
  var props = {
    entries: ["./" + file],
    debug : true,
    extensions: [".jsx"],
    transform: [["babelify", {
      presets: ["react", "es2015"],
      ignore: babelIgnoreList
    }]]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
    .on("error", handleErrors)
      .pipe(source("react-wa.js"))
      .pipe(gulp.dest("./build/"))
      .pipe(buffer())
      // .pipe(uglify({
        // mangle: true
      // }))
      .pipe(rename("react-wa.js"))
      .pipe(gulp.dest("./build"))
  }

  // listen for an update and run rebundle
  bundler.on("update", function() {
    rebundle();
    gutil.log("Rebundle...");
  });

  // run it once the first time buildScript is called
  return rebundle();
}

// development
gulp.task("src-dev", [
  "lint-dev"
], function() {
  return buildScript("react-wa.jsx", false);
});

gulp.task("src-dev-fast", function() {
  return buildScript("react-wa.jsx", false);
});

gulp.task("dev-fast", [
  "html",
  "css",
  "src-dev-fast"
], function() {
  gulp.watch([
    "css/**/*",
    "**/*.jsx",
    "!build/**",
    "!node_modules/**"
  ],[
    "html",
    "css",
    "src-dev-fast"
  ]);
});

gulp.task("dev", [
  "html",
  "css",
  "fonts",
  "images",
  "video",
  "src-dev"
], function() {
  gulp.watch([
    "css/**/*",
    "**/*.js",
    "**/*.jsx",
    "!build/**",
    "!node_modules/**"
  ],[
    "html",
    "css",
    "src-dev"
  ]);
});

// production
gulp.task("src-prod", ["lint-prod"], function() {
  return buildScript("react-wa.jsx", false);
});

gulp.task("prod", [
  "html",
  "css",
  "images",
  "video",
  "fonts",
  "src-prod"
]);
