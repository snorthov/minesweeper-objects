try {
	var dotenv = require('dotenv');
	dotenv.load({silent: true});
} catch (error) {
	console.log(error);
}

var gulp = require('gulp');

var sonarqubeScanner = require('sonarqube-scanner');
gulp.task('sonar', function(callback) {
	sonarqubeScanner({
		serverUrl: process.env.SONAR_URL,
		token: process.env.SONAR_KEY,
		options: {
		}
	}, callback);
 });

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

var zip = require("gulp-zip");
gulp.task("zip", function() {
	return gulp.src(["**", "!minesweeper-objects.zip"])
		.pipe(zip("minesweeper-objects.zip"))
		.pipe(gulp.dest("./"));
});
 
gulp.task('default', ['zip']);
	