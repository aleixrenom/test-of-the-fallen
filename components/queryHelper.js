const { Client } = require('pg');
const dbclient = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
	  rejectUnauthorized: false
	}
});

async function getWeatherSchedule() {
	await dbclient.connect()
	console.log("Connected successfuly.")
	const results = await dbclient.query(`
	SELECT *
	FROM WeatherSchedule
	`)
	// transform into object
	await dbclient.end()
	// return the object

}