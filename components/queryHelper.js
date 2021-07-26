// const { Client } = require('pg');
// const dbclient = new Client({
// 	connectionString: process.env.DATABASE_URL,
// 	ssl: {
// 	  rejectUnauthorized: false
// 	}
// });

const { Pool } = require('pg');
const dbclient = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: {
		  rejectUnauthorized: false
		}
	});

async function getWeatherSchedule() {
	try {
		console.log("Connected successfuly.")
		const results = await dbclient.query(`
		SELECT *
		FROM WeatherSchedule
		WHERE id = 1
		`)
		return results.rows[0]
	} catch(err) {
		console.error("Error in getWeatherSchedule: " + err)
	} 
}

async function updateWeatherSchedule(weatherObject) {
	try {
		console.log("Connected successfuly.")
		const results = await dbclient.query(`
		UPDATE WeatherSchedule
		SET 
			status = $1,
			type = $2,
			temperature = $3,
			lightning = $4,
			winds = $5,
			image = $6,
			color = $7,
			forecastChannel = $8,
			weatherChannel = $9
		WHERE id = 1
		`, 
		[
			weatherObject.status, 
			weatherObject.type, 
			weatherObject.temperature,
			weatherObject.lightning,
			weatherObject.winds,
			weatherObject.image,
			weatherObject.color,
			weatherObject.forecastchannel,
			weatherObject.weatherchannel
		])
		console.log("Weather schedule updated successfuly.")
	} catch(err) {
		console.error("Error in getWeatherSchedule: " + err)
	} 
}

module.exports = {
	getWeatherSchedule,
	updateWeatherSchedule
}