const cf = require('./commonFunctions.js');
const ws = require('../commands/old/ws.js');
const schedule = require('node-schedule');
const data = cf.readDataFile('data');
let today = new Date();

/*

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

schedule.scheduleJob('0 6 * * *', () => {});

*/

function updateToday() {
	today = new Date();

	schedule.scheduleJob('0 6 15 * *', () => {
		today = new Date();
	});
}

function turnOnSchedules() {
	weather();
	updateToday();
	announceLastDayOfMonth();
	announceDuskAndDawn();
	schedule.scheduleJob('0 6 1 * *', () => {changeServerIcon();});
}

function weather() {
	// every day at 7pm GMT+0
	schedule.scheduleJob('0 6 * * *', () => {
		try {
			ws.rollWeather();
		} catch (error) {
			console.log("Error rolling the scheduled weather: " + error)
		}
	});
}

/**
 * Returns true if it's a day month.
 */
function checkIfDayMonth() {
	try {
		const month = new Date().getMonth() + 1;

		if (month % 2 == 0) {
			// even, so night
			return false;
		} else {
			// odd, so day
			return true;
		}
	} catch(err) {
		console.log("There was an error in scheduling with checkIfDayMonth() - " + err)
	}
}

 function changeServerIcon() {
	 try {
		const rotf = cf.client.guilds.get(data.rotfId);
		if (checkIfDayMonth()) {
		   rotf.setIcon(data.images.day);
		} else {
		   rotf.setIcon(data.images.night);
		}
	 } catch(err) {
		console.log("There was an error in scheduling with changeServerIcon() - " + err)
	}
 }

 // https://i.imgur.com/vLJ9aDr.png
 function announceLastDayOfMonth() {
	try {
		let lastDayOfThisMonth = new Date();
		lastDayOfThisMonth.setFullYear(today.getFullYear(), today.getMonth() + 1, 0);

		schedule.scheduleJob('0 6 ' + lastDayOfThisMonth.getDate() + ' * *', () => {
			try {
				switch (today.getMonth() + 1) {
					case 1:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The sun hovers over the horizon in the west, foretelling the coming night.```"
						);
						break;
					case 2:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The dim rays of the sun can be seen on the east. This cold night is coming to an end.```"
						);
						break;
					case 3:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The sun is beginning to fall below the landmass, leaving space for the first fully dark night to come.```"
						);
						break;
					case 4:
						// cf.client.channels.cache.get(data.inWorldHappeningsId).send(
						// 	"```\n\
						// 	X\
						// 	\n```"
						// );
						break;
					case 5:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The sunset covers this lands with burning beauty, yet there is a grim feeling in the air...```"
						);
						break;
					case 6:
						// cf.client.channels.cache.get(data.inWorldHappeningsId).send(
						// 	"```Hopeful rays of light can be seen crawling out over the horizon after this long pitch black night.```"
						// );
						break;
					case 7:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```As foretold the bright summer sun burns red in the sky, creating the only summer sunset.```"
						);
						break;
					case 8:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The dawn finally appears and threatens the darkness of these lands with its light.```"
						);
						break;
					case 9:
						// cf.client.channels.cache.get(data.inWorldHappeningsId).send(
						// 	"```X```"
						// );
						break;
					case 10:
						// cf.client.channels.cache.get(data.inWorldHappeningsId).send(
						// 	"```X```"
						// );
						break;
					case 11:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
						  "```As the sun wanes in the west, a bright white moon starts showing its face under the eastern skies.```"
						);
						break;
					case 12:
						// cf.client.channels.cache.get(data.inWorldHappeningsId).send(
						// 	"```X```"
						// );
						break;
				}
			} catch(err) {
				console.log("There was an error in scheduling with announceLastDayOfMonth() - " + err)
			}
		});
	} catch(err) {
		console.log("There was an error in scheduling with announceLastDayOfMonth() - " + err)
	}
 }

 function announceDuskAndDawn() {
	try {
		schedule.scheduleJob('0 6 1 * *', () => {
			try {
				updateToday();
				switch (today.getMonth() + 1) {
					case 1:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The winter's sun rises from the east after a bright full moon night. The promise of snow and peace in the only day of winter fills the people's hearts with joy.```"
						);
						break;
					case 2:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The sky is covered with red hues as the day falls and the waning gibbous moon peeks its head from the east. Hanging tight to their coats the Elysians return to their homes, dreaming of the first day of spring.```"
						);
						break;
					case 3:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The first rays of spring shine brightly from the east and bathe this fallen lands with life and color. It won't be long until the plains are covered with flowers and the rains bring life to all flora and fauna.```"
						);
						break;
					case 4:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The imposing sunset slowly fades on the west, and the crescent moon starts showing itself. The first of the dark nights approaches, and with it a subconscious feeling of unease fills the minds of the inhabitants of these lands.```"
						);
						break;
					case 5:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The crescent moon retreats to its home past the horizon and the sun of spring returns bright through this lasting sunrise. It won't be long until summer comes, so the Elysians strive to take advantage of this last beautiful month of spring.```"
						);
						break;
					case 6:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The sun sets on the west to make way for the summer to come, but no moon raises this time. The lands are progressively covered with pitch-black darkness, and people huggle around any light source they have, not daring to step into this summer's moonless obscurity.```"
						);
						break;
					case 7:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The twilight of this moonless night shines over the horizon, allowing the only summer's sun to relieve the citizens of this world with it bright and powerful magnificence. Everyone will rejoice in the warm summer's festivities until the darkness comes around once more.```"
						);
						break;
					case 8:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The summer sun finally disappears and the waxing crescent moon peeks its head over the Fallen. This night will be the last dark night of the year, and with all summer festivities celebrated, the citizens leave the parks and plazas and retrieve to their homes.```"
						);
						break;
					case 9:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The first sun of autumn comes back around, and with it brings the chilly winds from the north and the falling brown leaves of the trees that create a beautiful carpet of colors in the forests. The Elysians start taking out their jerseys and jackets and get ready for a cloudy month.```"
						);
						break;
					case 10:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```X```"
						);
						break;
					case 11:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The autum's last sun shows itself over the horizon as the leaves of the caduceous trees start slowly disappearing. The sky will be clouded and the air chilly, so the citizens are already getting the winter clothes out of the cabinets.```"
						);
						break;
					case 12:
						cf.client.channels.cache.get(data.inWorldHappeningsId).send(
							"```The big round bright moon hovers ominous over the horizon: this is the last month of the year, and the month of the full moon. Everything is covered in dim light; thin fog crawls over the wilds, howls of unknown origin are heard in the distance and shivers go through explorers' spines while the moon slowly crawls its way to its resting place in the west.```"
						);
						break;
				}
			} catch(err) {
				console.log("There was an error in scheduling with announceDuskAndDawn() - " + err)
			}
		});
	} catch(err) {
		console.log("There was an error in scheduling with announceDuskAndDawn() - " + err)
	}
 }

module.exports = {
	turnOnSchedules,
	changeServerIcon
}