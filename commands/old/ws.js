const cf = require('../../components/commonFunctions.js');
const qh = require('../../components/queryHelper.js');
const weather = require('../../components/weather.js');
const Discord = require('discord.js');

module.exports = {
	name: 'ws',
	description: 'Perform various tasks related to the scheduling of weather.',
	async rollWeather() {
		// get and save the data file
		let data = await qh.getWeatherSchedule();

		if (data.status === "off") return;

		// if it is on, create an embed with the forecast info in the data file
		const todayWeatherEmbed = new Discord.MessageEmbed()
		.setTitle(data.type)
		.addField('Temperature', data.temperature)
		.addField('Lightning', data.lightning)
		.addField('Winds', data.winds)
		.setThumbnail(data.image)
		.setColor(data.color);

		// post it in the weather channel
		cf.client.channels.cache.get(data.weatherChannel).send(todayWeatherEmbed);

		// roll a new weather
		const rolledWeather = weather.getCurrentSeason().roll(); // this is an object with weather values

		// save the new values to the data object
		data.type = rolledWeather.type;
		data.temperature = rolledWeather.temperature;
		data.lightning = rolledWeather.lightning;
		data.winds = rolledWeather.winds;
		data.image = rolledWeather.image;
		data.color = rolledWeather.color;

		// create an embed with the newly rolled weather values
		const tomorrowWeatherEmbed = new Discord.MessageEmbed()
		.setTitle(rolledWeather.type)
		.addField('Temperature', rolledWeather.temperature)
		.addField('Lightning', rolledWeather.lightning)
		.addField('Winds', rolledWeather.winds)
		.setThumbnail(rolledWeather.image)
		.setColor(rolledWeather.color);

		// post it in the forecast channel
		// (!) changed to be the primary weather until I figure out the database stuff
		// cf.client.channels.cache.get(data.forecastChannel).send("**Next weather:**");
		cf.client.channels.cache.get(data.forecastChannel).send(tomorrowWeatherEmbed);

		// save the new values to the data file
		await qh.updateWeatherSchedule(data);
	},
	async execute(message, args) {
		switch (args[0]) {
			case "forceRoll":
				if (!message.member.roles.cache.has(cf.readDataFile('data').roles.admin)) {
					message.channel.send("This command is only avaliable to Admins.");
					return;
				} else {
					if (cf.readDataFile('data').weatherSchedule.status === "off") {
						message.channel.send("The weather scheduling is turned off.");
						return;
					}
					await this.rollWeather();
				}
				break;
			case "on":
				try {
					let data = cf.readDataFile('data');

					if (data.status === "on") {
						message.channel.send("The scheduling is already on.");
						return;
					}

					data.status = "on";
					cf.writeDataFile(data,'data');

					message.channel.send("Scheduling turned on.")
				} catch(err) {
					message.channel.send("There was an error turning the scheduling on.");
					console.log("There was an error turning the scheduling on: " + err);
				}
				break;
			case "off":
				try {
					let data = cf.readDataFile('data');

					if (data.status === "off") {
						message.channel.send("The scheduling is already off.");
						return;
					}

					data.status = "off";
					cf.writeDataFile(data,'data');

					message.channel.send("Scheduling turned off.")
				} catch(err) {
					message.channel.send("There was an error turning the scheduling off.");
					console.log("There was an error turning the scheduling off: " + err);
				}
				break;
			case "status":
				try {
					message.channel.send("The weather scheduling is " + cf.readDataFile('data').weatherSchedule.status + ".");
				} catch(err) {
					message.channel.send("There was an error checking the scheduling status.");
					console.log("There was an error checking the scheduling status: " + err);
				}
				break;
			default:
				message.channel.send("Avaliable arguments: forceRoll (admin), on, off, status.");
				break;
		}
	}
}