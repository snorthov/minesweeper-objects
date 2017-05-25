try {
	var dotenv = require('dotenv');
	dotenv.load({silent: true});
} catch (error) {
	console.log(error);
}

var webdriver = require('selenium-webdriver'),
    username = process.env.SELENIUM_NAME,
    accessKey = process.env.SELENIUM_KEY,
    driver;

//TODO - Test on more plaforms ...
driver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'chrome',
    'platform': 'Windows XP',
    'version': '43.0',
    'username': username,
    'accessKey': accessKey,
   	'name': "Minesweeper"
  }).
  usingServer("http://" + username + ":" + accessKey +
              "@ondemand.saucelabs.com:80/wd/hub").
  build();

//TODO - Rewrite to use Mocha ...
driver.getSession().then(function (session) {
	var id = session.id_;
	var SauceLabs = require("saucelabs");
	var saucelabs = new SauceLabs({
		username: username,
		password: accessKey
	}); 
	driver.get("https://minesweeper-objects.mybluemix.net/");
	console.log("Starting tests ...");
	driver.getTitle().then(function (title) {
	    console.log("title is: " + title);
	    var passed = title === "Minesweeper";
	    var done = function () {
			console.log("done: " + passed);
		};
		//console.log(id);
		driver.quit();
	    saucelabs.updateJob(id, {
	      name: title,
	      passed: passed
	    }, done);
	});
});


