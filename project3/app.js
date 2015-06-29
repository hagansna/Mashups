var express = require('express');
var Request = require('request');
var bodyParser = require('body-parser');

var app = express();

// Set EJS as templating language
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
// Set up the public directory to serve our Javascript file
app.use(express.static(__dirname + '/public'));

// Enable json body parsing of application/json
app.use(bodyParser.json());

//******* DATABASE Configuration *******
// The username you use to log in to cloudant.com
var CLOUDANT_USERNAME="nah364";
// The name of your database
var CLOUDANT_DATABASE="blog-summer";
// These two are generated from your Cloudant dashboard of the above database.
var CLOUDANT_KEY="hissougetyagalsubsearlse";
var CLOUDANT_PASSWORD="nyBAA37EK5I3RvvlJql2GYEB";

var CLOUDANT_URL = "https://" + CLOUDANT_USERNAME + ".cloudant.com/" + CLOUDANT_DATABASE;

//******* ROUTES *******
// GET - route to load the main page
app.get("/", function (request, response) {
	console.log("In main route");
	response.render('index', {message: "The Movie Soundtrack Playlist", data: false});
});

app.get("/search/:movie", function (request, response) {
	var searchTerm = request.params.movie;
	console.log("searching for " + searchTerm);
	var requestURL = "https://api.themoviedb.org/3/search/movie?api_key=942a3945b8e02f900bf408d161de2dd1&query=" + searchTerm;
	Request(requestURL, function (err, resp, body) {
		if (!err && resp.statusCode == 200) {
			var theData = JSON.parse(body);
			console.log(theData);
			//response.json(body);
			//response.send("Here");
			response.render('index', {message: 'Did you mean...?', data: theData});
			
		}
		else {
			response.render('index', {message: "oops, something went wrong!", data: false});
		}
	});
});

app.get('*', function (request, response) {
	response.send('404!!!!');
});

// set environment port variable
var port = process.env.PORT || 3000;

app.listen(port);
console.log('Express started on port ' + port);