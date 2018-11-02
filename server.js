/*eslint-env node, express */

// Initialize Express
var express = require("express");
var app = express();

// Set up a simple static server for the public directory
app.use('/', express.static(__dirname + "/public"));

// Listen for requests on a port
var port = process.argv[2] || process.env.PORT || process.env.port || process.env.VCAP_APP_PORT || 8081;
app.listen(port, function() {
	console.log("Server running on port: %d", port);
});