/*eslint-env node, express */

// Initialize Express
var express = require('express');
var app = express();
 
// Set up a simple static server for the public directory
app.use('/', express.static(__dirname + "/public"));

// Get IP of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application
var host = process.env.VCAP_APP_HOST || 'localhost';

// Get the port on the DEA for communication with the application
var port = process.env.VCAP_APP_PORT || 3000;

// Serve the application
//TODO - print when the server is ready
app.listen(port, host);