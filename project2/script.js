var cityWeather = {
	ready: false,
	animate: false,
	rainBool: false,
	apiData: {}
};
var clouds = [];
var rains = [];
// var directionExp = [1, -1];

var weatherCity = function(city) {
	clouds = [];
	rains = [];
	console.log(city);
	url = 'http://api.openweathermap.org/data/2.5/weather?q=';
	weatherURL = url + city;
	$.ajax({
		url: weatherURL,
		type: 'GET',
		dataType: 'json',
		error: function(err) {
			console.log(err);
			cityWeather.apiData.condition = 0;
		},
		success: function(data) {
			console.log(data);
			cityWeather.apiData.condition = data.weather[0].main;
			cityWeather.apiData.currentTime = data.dt;
			cityWeather.apiData.sunset = data.sys.sunset;
			cityWeather.apiData.sunrise = data.sys.sunrise;
			cityWeather.apiData.clouds = data.clouds.all;
			cityWeather.apiData.windSpeed = data.wind.speed;
			if (cityWeather.apiData.condition == "Rain") {
				cityWeather.rainBool = true;
				cityWeather.apiData.rain = data.rain['3h'];
			} else {
				cityWeather.rainBool = false;
			}
			// cityWeather.apiData.rain = data.rain['3h'];
			console.log(data.dt);
			console.log(data.sys.sunset);
			console.log(data.sys.sunrise);
			cityWeather.ready = true;
			console.log(cityWeather);
		}
	});
};

function setup() {
	console.log('setting up');
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	if (cityWeather.apiData.condition) {
		clear();
		if (cityWeather.apiData.condition == "Clear") {
			if ((cityWeather.apiData.currentTime < cityWeather.apiData.sunrise && cityWeather.apiData.currentTime > cityWeather.apiData.sunset) || (cityWeather.apiData.currentTime < cityWeather.apiData.sunrise && cityWeather.apiData.currentTime < cityWeather.apiData.sunset)) {
				skyDraw('night');
				// background(0);
				// fill(200,200,200);
				// ellipse(windowWidth/2, windowHeight/2, 300, 300);
			} else {
				skyDraw('day');
				// background(0, 100, 175);
				// fill(255, 255 ,0);
				// ellipse(windowWidth/2, windowHeight/2, 300, 300);
			}
		} else if (cityWeather.apiData.condition == "Clouds") {
			if ((cityWeather.apiData.currentTime < cityWeather.apiData.sunrise && cityWeather.apiData.currentTime > cityWeather.apiData.sunset) || (cityWeather.apiData.currentTime < cityWeather.apiData.sunrise && cityWeather.apiData.currentTime < cityWeather.apiData.sunset)) {
				skyDraw('night');
				// background(0);
				// fill(200,200,200);
				// ellipse(windowWidth/2, windowHeight/2, 300, 300);
				if (cityWeather.ready) {
					for (var i=0; i<cityWeather.apiData.clouds; i++) {
						clouds[i] = new Clouds(random(windowWidth),random(windowHeight), random(50,200), random(50, 200), random(-(cityWeather.apiData.windSpeed), cityWeather.apiData.windSpeed), random(-(cityWeather.apiData.windSpeed), cityWeather.apiData.windSpeed));
					}
					cityWeather.ready = false;
					cityWeather.animate = true;
				}
			} else {
				skyDraw('day');
				// background(0, 100, 175);
				// fill(255, 255 ,0);
				// ellipse(windowWidth/2, windowHeight/2, 300, 300);
				if (cityWeather.ready) {
					for (var j=0; j<cityWeather.apiData.clouds; j++) {
						clouds[j] = new Clouds(random(windowWidth),random(windowHeight), random(50,200), random(50, 200), random(-(cityWeather.apiData.windSpeed), cityWeather.apiData.windSpeed), random(-(cityWeather.apiData.windSpeed), cityWeather.apiData.windSpeed));
					}
					cityWeather.ready = false;
					cityWeather.animate = true;
				}
			}
		} else if (cityWeather.apiData.condition == "Rain") {
			skyDraw('rain');
			if (cityWeather.ready) {
				var rainTotal = cityWeather.apiData.rain * 100;
				if (rainTotal > 100) {
					rainTotal = 100;
				}
				console.log(rainTotal);
				for (var l = 0; l < rainTotal; l++) {
					rains[l] = new Rain(random(windowWidth), 0, 20, 50, 0, random(10,20));
				}
				cityWeather.ready = false;
				cityWeather.animate = true;
			}
		}
		if (cityWeather.animate && !cityWeather.rainBool) {
			for (var k=0; k < clouds.length; k++) {
				clouds[k].update();
				clouds[k].display();
			}
		} else if (cityWeather.animate && cityWeather.rainBool) {
			for (var m=0; m < rains.length; m++) {
				rains[m].update();
				rains[m].display();
			}
		}
	}
}

function skyDraw(dayOrNight) {
	if (dayOrNight == "day") {
		background(0, 100, 175);
		fill(255, 255, 0);
		ellipse(windowWidth/2, windowHeight/2, 300, 300);
	} else if (dayOrNight == "night") {
		background(0);
		fill(200, 200 ,200);
		ellipse(windowWidth/2, windowHeight/2, 300, 300);
	} else if (dayOrNight == "rain"){
		background(200, 200, 200);
	}
}

function Rain(xPos, yPos, xWidth, yHeight, xSpeed, ySpeed) {
	this.x = xPos;
	this.y = yPos;
	this.xWidth = xWidth;
	this.yHeight = yHeight;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;
	this.rColor = color(0, 100, 255);
}

Rain.prototype.display = function() {
	fill(this.rColor);
	rectMode(CENTER);
	rect(this.x, this.y, this.xWidth, this.yHeight);
};

Rain.prototype.update = function() {
	this.x += this.xSpeed;
	this.y += this.ySpeed;
	this.checkEdges();
};

Rain.prototype.checkEdges = function() {
	var widthBoundsLow = -(this.xWidth/2);
	var widthBoundsHigh = windowWidth + (this.xWidth/2);
	var heightBoundsLow = -(this.yHeight/2);
	var heightBoundsHigh = windowHeight + (this.yHeight/2);

	if (this.xSpeed > 0) {
		if (this.x > widthBoundsHigh) {
			this.x = widthBoundsLow;
		}
	} else {
		if (this.x < widthBoundsLow) {
			this.x = widthBoundsHigh;
		}
	}
	if (this.ySpeed > 0) {
		if (this.y > heightBoundsHigh) {
			this.y = heightBoundsLow;
		}
	} else {
		if (this.y < heightBoundsLow) {
			this.y = heightBoundsHigh;
		}
	}
};

function Clouds(xPos, yPos, xWidth, yHeight, xSpeed, ySpeed) {
	this.startX = xPos;
	this.startY = yPos;
	this.x = xPos;
	this.y = yPos;
	this.xWidth = xWidth;
	this.yHeight = yHeight;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;

	this.cColor = color(255);
}

Clouds.prototype.display = function() {
	fill(this.cColor);
	rectMode(CENTER);
	rect(this.x, this.y, this.xWidth, this.yHeight);
};

Clouds.prototype.update = function() {
	this.x += this.xSpeed;
	this.y += this.ySpeed;
	this.checkEdges();
};

Clouds.prototype.checkEdges = function() {
	var widthBoundsLow = -(this.xWidth/2);
	var widthBoundsHigh = windowWidth + (this.xWidth/2);
	var heightBoundsLow = this.startY - (this.yHeight/2);
	var heightBoundsHigh = this.startY + (this.yHeight/2);

	if (this.xSpeed > 0) {
		if (this.x > widthBoundsHigh) {
			this.x = widthBoundsLow;
		}
	} else {
		if (this.x < widthBoundsLow) {
			this.x = widthBoundsHigh;
		}
	}

	if (this.y > heightBoundsHigh) {
		if (this.ySpeed > 0) {
			this.ySpeed *= -1;
		}
	}
	else if (this.y < heightBoundsLow) {
		if (this.ySpeed < 0)  {
			this.ySpeed *= -1;
		}
	}

	// if (this.ySpeed > 0) {
	// 	if (this.y > heightBoundsHigh) {
	// 		// this.y = heightBoundsLow;
	// 		this.ySpeed *= -1;
	// 	}
	// } else {
	// 	if (this.y < heightBoundsLow) {
	// 		// this.y = heightBoundsHigh;
	// 		this.ySpeed *= -1;
	// 	}
	// }
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 32) {
		weatherCity('New York');
	}
}

if (annyang) {
	var commands = {
		'show me the weather in *city': weatherCity
	};

  // Add our commands to annyang
	annyang.addCommands(commands);

  // Start listening.
	annyang.start();
}



