const cf = require('./commonFunctions.js');
const data = cf.readDataFile('data');

class Weather {

	constructor(type, minTemp, maxTemp, possibleLightnings, minWind, maxWind, image, color) {
		this.type = type;
		this.minTemp = minTemp;
		this.maxTemp = maxTemp;
		this.possibleLightnings = possibleLightnings;
		// "None", "Mild", "Moderate", "Severe", "Mild Tribulation", "Tribulation"
		this.minWind = minWind;
		this.maxWind = maxWind;
		this.image = image;
		this.color = color;
	}

	/**
	 * Rolls the particular weather values and returns an object with weather type (title), temperature (field),
	 * lightning (field), winds (field), image url (thumbnail), and color (hex value)
	 */
	roll() {
		try {
			let temp = cf.rnd(this.minTemp, this.maxTemp);
			let lightning = this.possibleLightnings[cf.rnd(0, this.possibleLightnings.length - 1)];
			let wind = cf.rnd(this.minWind, this.maxWind);

			if (this.type === "Something's different...") {
				return {
					type: this.type,
					temperature: "???",
					lightning: "???",
					winds: "???",
					image: this.image,
					color: this.color
				}
			}

			return {
				type: this.type,
				temperature: temp + "°C / " + cf.toFh(temp) + "°F",
				lightning: lightning,
				winds: wind + "mph (" + cf.nameOfWind(wind) + ")",
				image: this.image,
				color: this.color
			}

			// return new Discord.MessageEmbed()
			// 	.setTitle(this.type)
			// 	.addField("Temperature", temp + "°C / " + cf.toFh(temp) + "°F")
			// 	.addField("Lightning", lightning)
			// 	.addField("Winds", wind + "mph (" + cf.nameOfWind(wind) + ")")
			// 	.setThumbnail(this.image)
			// 	.setColor(this.color);
		} catch (error) {
			console.log("Error creating the rolling embed: " + error);
		}
	}
}

class Season {

	// Values of all types of weather for this season
	constructor(clearSkies, cloudy, electricStorm, rain, event, percClearSkies, percCloudy, percElectricStorm, percRain, percEvent) {
		this.clearSkies = clearSkies;
		this.cloudy = cloudy;
		this.electricStorm = electricStorm;
		this.rain = rain;
		this.event = event;

		// Percentile possibility of the type of weather to happen
		this.percClearSkies = percClearSkies;
		this.percCloudy = percCloudy;
		this.percElectricStorm = percElectricStorm;
		this.percRain = percRain;
		this.percEvent = percEvent;
	}

	// Returns random weather object taking into account the percentages
	roll() {
		try {
			let weatherList = [this.clearSkies, this.cloudy, this.electricStorm, this.rain, this.event];
			let percList = [this.percClearSkies, this.percCloudy, this.percElectricStorm, this.percRain, this.percEvent];

			let totalPercentage = 0;
			for (let i of percList) { totalPercentage += i; }

			let result = cf.rnd(0, totalPercentage);

			for (let x = weatherList.length-1; x >= 0; x--) {
				totalPercentage -= percList[x];
				if (result >= totalPercentage) {
					return weatherList[x].roll();
				}
			}
		} catch (error) {
			console.log("Error handling the rolling in Season: " + error);
		}
	}
}

const autumn = new Season(
	// Lightnings: "None", "Mild", "Moderate", "Severe", "Mild Tribulation", "Tribulation"
	new Weather(
		"Clear Skies",
		1, 15,
		["None"],
		0, 12,
		data.images.clearSkies,
		0xf4d03f),
	new Weather(
		"Cloudy",
		1, 10,
		["None", "Mild"],
		7, 18,
		data.images.cloudy,
		0x5d6d7e),
	new Weather(
		"Electric storm",
		0, 10,
		["Severe", "Mild Tribulation", "Tribulation"],
		13, 63,
		data.images.electricStorm,
		0xc0392b),
	new Weather(
		"Rain",
		1, 15,
		["None", "Mild", "Moderate", "Severe", "Mild Tribulation"],
		13, 63,
		data.images.rain,
		0x2471a3),
	new Weather(
		"Something's different...",
		1000, 9999,
		["??"],
		-9999, -1000,
		data.images.event,
		0xc9c9c9),
	/*CS*/ 20,
	/*Cl*/ 36,
	/*Rn*/ 25,
	/*ES*/ 13,
	/*Ev*/ 6);

const winter = new Season(
	// Lightnings: "None", "Mild", "Moderate", "Severe", "Mild Tribulation", "Tribulation"
	new Weather(
		"Clear Skies",
		-10, 0,
		["None"],
		0, 12,
		data.images.clearSkies,
		0xf4d03f),
	new Weather(
		"Cloudy",
		-20, 0,
		["None", "Mild"],
		7, 18,
		data.images.cloudy,
		0x5d6d7e),
	new Weather(
		"Electric storm",
		-25, -5,
		["Severe", "Mild Tribulation", "Tribulation"],
		13, 63,
		data.images.electricStorm,
		0xc0392b),
	new Weather(
		"Snow",
		-35, -10,
		["None"],
		0, 63,
		data.images.snow,
		0xd6eaf8),
	new Weather(
		"Something's different...",
		1000, 9999,
		["??"],
		-9999, -1000,
		data.images.event,
		0xc9c9c9),
	/*CS*/ 18,
	/*Cl*/ 28,
	/*Rn*/ 35,
	/*ES*/ 13,
	/*Ev*/ 6);

const spring = new Season(
	// Lightnings: "None", "Mild", "Moderate", "Severe", "Mild Tribulation", "Tribulation"
	new Weather(
		"Clear Skies",
		5, 20,
		["None"],
		0, 12,
		data.images.clearSkies,
		0xf4d03f),
	new Weather(
		"Cloudy",
		2, 15,
		["None", "Mild"],
		7, 18,
		data.images.cloudy,
		0x5d6d7e),
	new Weather(
		"Electric storm",
		2, 20,
		["Severe", "Mild Tribulation", "Tribulation"],
		13, 63,
		data.images.electricStorm,
		0xc0392b),
	new Weather(
		"Rain",
		1, 15,
		["None", "Mild", "Moderate", "Severe", "Mild Tribulation"],
		0, 63,
		data.images.rain,
		0xd6eaf8),
	new Weather(
		"Something's different...",
		1000, 9999,
		["??"],
		-9999, -1000,
		data.images.event,
		0xc9c9c9),
	/*CS*/ 39,
	/*Cl*/ 10,
	/*Rn*/ 32,
	/*ES*/ 13,
	/*Ev*/ 6);

const summer = new Season(
	// Lightnings: "None", "Mild", "Moderate", "Severe", "Mild Tribulation", "Tribulation"
	new Weather(
		"Clear Skies",
		20, 40,
		["None"],
		0, 12,
		data.images.clearSkies,
		0xf4d03f),
	new Weather(
		"Cloudy",
		15, 35,
		["None", "Mild"],
		7, 18,
		data.images.cloudy,
		0x5d6d7e),
	new Weather(
		"Electric storm",
		25, 45,
		["Severe", "Mild Tribulation", "Tribulation"],
		13, 63,
		data.images.electricStorm,
		0xc0392b),
	new Weather(
		"Rain",
		10, 25,
		["None", "Mild", "Moderate", "Severe"],
		0, 63,
		data.images.rain,
		0xd6eaf8),
	new Weather(
		"Something's different...",
		1000, 9999,
		["??"],
		-9999, -1000,
		data.images.event,
		0xc9c9c9),
	/*CS*/ 50,
	/*Cl*/ 21,
	/*Rn*/ 10,
	/*ES*/ 13,
	/*Ev*/ 6);

/**
 * Checks what season it is and returns a Season object
 */
function getCurrentSeason() {
	try {
		let currentSeason;
		const date = new Date();
		switch (date.getMonth() + 1) {
		case 12:
		case 1:
		case 2:
			currentSeason = winter;
			break;
		case 3:
		case 4:
		case 5:
			currentSeason = spring;
			break;
		case 6:
		case 7:
		case 8:
			currentSeason = summer;
			break;
		case 9:
		case 10:
		case 11:
			currentSeason = autumn;
			break;
		}
		return currentSeason;
	} catch (error) {
		console.log("Error checking the current season: " + error)
	}
}

module.exports = {
	Weather,
	Season,
	autumn,
	summer,
	spring,
	winter,
	getCurrentSeason
}