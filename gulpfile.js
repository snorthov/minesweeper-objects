
var zip = require("gulp-zip");
var gulp = require('gulp');

/*
var minify = require('gulp-minifier');

	  .pipe(minify({
	    minify: true,
	    collapseWhitespace: true,
	    conservativeCollapse: true,
	    minifyJS: true,
	    minifyCSS: true,
        exclude: ["node_modules/**.*"],
	    getKeptComment: function (content, filePath) {
	        var m = content.match(/\/\*![\s\S]*?\*\//img);
	        return m && m.join('\n') + '\n' || '';
	    }}))
*/

gulp.task("default", function () {
  return gulp.src(["**", "!deploy.zip"])
      .pipe(zip("deploy.zip"))
      .pipe(gulp.dest("./"));
});