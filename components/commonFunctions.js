const fs = require('fs');
const d20 = require('d20');
const qh = require('./queryHelper.js');

let client;
let clockInterval;

function rnd(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toFh(celsius) {
	let fh = (celsius * 9 / 5) + 32;
	fh = +fh.toFixed(2);
	return fh;
}

function nameOfWind(mph) {
	if (mph >= 0 && mph < 1) {
		return "Calm";
	} else if (mph >= 1 && mph < 3) {
		return "Light air";
	} else if (mph >= 3 && mph < 7) {
		return "Light breeze";
	} else if (mph >= 7 && mph < 12) {
		return "Gentle breeze";
	} else if (mph >= 12 && mph < 18) {
		return "Moderate breeze";
	} else if (mph >= 18 && mph < 24) {
		return "Breeze";
	} else if (mph >= 24 && mph < 31) {
		return "Strong breeze";
	} else if (mph >= 31 && mph < 38) {
		return "Moderate gale";
	} else if (mph >= 38 && mph < 46) {
		return "Gale";
	} else if (mph >= 46 && mph < 54) {
		return "Severe gale";
	} else if (mph >= 54 && mph < 63) {
		return "Storm";
	} else if (mph >= 63 && mph < 72) {
		return "Violent storm";
	} else if (mph >= 72) {
		return "Hurricane";
	} else {
		return "??";
	}
}

/**
 * Reads the json data file and returns an object with all the data.
 * 
 * @param {string} fileName  Name of the data file without extension
 * @return {object} Object with the data
 */
function readDataFile(fileName) {
	try {
		let rawData = fs.readFileSync(fileName + '.json');
		let obj = JSON.parse(rawData);
		return obj;
	} 
	catch(err) {
		console.log("There has been an error reading the data file: " + err);
	}
}

/**
 * Gets the object with the updated data and writes it back to the file.
 * 
 * @param {object}	obj	The object with the updated data
 * @param {string} fileName Name of the data file without extension
 */
function writeDataFile(obj, fileName) {
	let json = JSON.stringify(obj, null, 2); //convert it back to json
	fs.writeFile(fileName + '.json', json, callback); // write it back
	function callback(whatever) {}
}

/**
 * Rolls a die and returns a string with the result.
 * 
 * @param {string} rollString What wants to be rolled in _d_+_ format
 * @return {string} String formatted for Discord
 */
function roll(rollString) {

	const symbols = new RegExp('[+\\-*/]');
	let inputString = rollString;
	let toRollArray = [];

	// if there are other characters than the symbols, numbers and "d", return the error message
	if (rollString.search('[^+\\-*/d0-9]') > 0) return "[Error] Incorrect characters";

	// loop to build the toRollArray to divide the command into usable pieces
	while (inputString.search(symbols) >= 0) {
		let symbolIndex = inputString.search(symbols); // index where the first symbol is found
		toRollArray.push(inputString.slice(0,symbolIndex)); // put the part before the symbol in the array
		toRollArray.push(inputString.charAt(symbolIndex)); // after that, put the symbol in the array
		inputString = inputString.slice(symbolIndex+1); // delete everything that was put on the array
	}
	toRollArray.push(inputString); // put whatever's after the last symbol in the array

	let outputString = "";
	let calculationString = "";
	toRollArray.forEach(element => { // go through the array of demanded rolls and build 2 strings: to show and to calculate the end result
		if (element.search('d') > 0) { // in case it's a dice roll

		outputString += " " + element; // write the name of the roll in the output
		let amounts = element.split("d"); // separate the roll title into number of dice [0] and die sides [1]

		for (i = 0; i < amounts[0]; i++) { // for a number of times equal to the number of dice...
			if (amounts[0] == 1) { // if there's only one die

			const roll = d20.roll(amounts[1]);
			calculationString += roll;
			if (roll == amounts[1]) { outputString += " (**" + roll + "**)"; // if it's a crit make it bold
			} else { outputString += " (" + roll + ")"; } // if it's not a crit put it as is

			} else if (i == 0) { // if there's multiple and this is the first

			const roll = d20.roll(amounts[1]);
			calculationString += "(" + roll;
			if (roll == amounts[1]) { outputString += " (**" + roll + "**,";
			} else { outputString += " (" + roll + ","; }

			} else if (i == amounts[0]-1) { // if there's multiple and this is the last

			const roll = d20.roll(amounts[1]);
			calculationString += "+" + roll + ")";
			if (roll == amounts[1]) { outputString += " **" + roll + "**)";
			} else { outputString += " " + roll + ")"; }

			} else { // if there's multiple and this is not the first nor the last

			const roll = d20.roll(amounts[1]);
			calculationString += "+" + roll;
			if (roll == amounts[1]) { outputString += " **" + roll + "**,";
			} else { outputString += " " + roll + ","; }

			} // end if-else chain
		} // end for loop

		} else if (element.search(symbols) > 0) { // in case it's a symbol

		outputString += " " + element;
		calculationString += element;

		} else { // in case it's a value

		outputString += " " + element;
		calculationString += element;

		}
	});

	outputString += " = " + eval(calculationString); // put the total result in the end
	return outputString.trim(); // return the output without blank spaces in the sides
	
}

module.exports = {
	rnd,
	toFh,
	nameOfWind,
	readDataFile,
	writeDataFile,
	client,
	roll,
	clockInterval
}