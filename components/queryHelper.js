const { Pool } = require('pg');
const dbclient = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: {
		  rejectUnauthorized: false
		}
	});

async function getWeatherSchedule() {
	try {
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
	} catch(err) {
		console.error("Error in getWeatherSchedule: " + err)
	} 
}

/**
 * Returns an object with the contents of the specified table
 * 
 * @param {string} table Name of the table you want to read
 * @returns {object} Contents of the table
 */
async function readTable(table) {
	try {
		const text = "SELECT * FROM " + table;
		const results = await dbclient.query(text);
		return results.rows;
	} catch(err) {
		console.error("Error reading table: " + err);
		return {error: "Error reading table: " + err}
	}
}
/**
 * Ask for a specific id to the ids table.
 * 
 * @param {String} type The type of id you're looking for (role, channel, guild...)
 * @param {String} name The name of the id (admin, weatherman, ...)
 * @returns {BigInt} Id asked
 */
async function getId(type, name) {
	try {
		const results = await dbclient.query(`
			SELECT id
			FROM ids
			WHERE type = $1 AND name = $2;
		`, [type, name]);
		return BigInt(results.rows[0].id);
	} catch(err) {
		console.error("Error in getId: " + err);
	}
}

/**
 * Ask for a row in the Arbitrary Storage table.
 * 
 * @param {String} field Name of the field you want to get data from.
 * @returns {Object} The requested row.
 */
async function getStorage(field) {
	try {
		const results = await dbclient.query(`
			SELECT * FROM arbitrary_storage
			WHERE name = $1
		`, [field]);
		return results.rows;
	} catch(err) {
		console.error("Error in getStorage: " + err);
	}
}

/**
 * Saves given data to the given field in the Arbitrary Storage table. Fields on the row can be null, but not the name.
 * 
 * @param {String} name Name of the field you want to save the data to.
 * @param {String} field_a First field of the row.
 * @param {String} field_b Second field of the row.
 * @param {String} field_c Third field of the row.
 */
async function setStorage(name, field_a, field_b, field_c) {
	try {

		const data = await getStorage(name);
		if (data[0] != undefined) { // if this exists in the table, update.

			await dbclient.query(`
				UPDATE arbitrary_storage
				SET field_a = $1, field_b = $2, field_c = $3
				WHERE name = $4
			`, [field_a, field_b, field_c, name]);

		} else { // if there's nothing with that name in the table, add it.

			await dbclient.query(`
				INSERT INTO arbitrary_storage VALUES
					($1, $2, $3, $4)
			`, [field_a, field_b, field_c, name]);

		}


	} catch(err) {
		console.error("Error in setStorage: " + err);
	}
}

/**
 * Delete a row in the Arbitrary Storage table.
 * 
 * @param {String} field Name of the field you want to delete.
 */
 async function deleteStorage(field) {
	try {
		const results = await dbclient.query(`
			DELETE FROM arbitrary_storage
			WHERE name = $1
		`, [field]);
		return results.rows;
	} catch(err) {
		console.error("Error in deleteStorage: " + err);
	}
}

module.exports = {
	getWeatherSchedule,
	updateWeatherSchedule,
	readTable,
	getId,
	getStorage,
	setStorage,
	deleteStorage
}