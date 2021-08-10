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
		cf.client.channels.cache.get(data.weatherchannel).send({ embeds: [todayWeatherEmbed] })
			.then()
			.catch(err => console.error(err));

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
		cf.client.channels.cache.get(data.forecastchannel).send("**Next weather:**").then().catch(e => console.error(e));
		cf.client.channels.cache.get(data.forecastchannel).send({ embeds: [tomorrowWeatherEmbed] })
			.then()
			.catch(err => console.error(err));

		// save the new values to the data file
		await qh.updateWeatherSchedule(data);
	},
	async execute(message, args) {
		switch (args[0]) {
			case "forceRoll":
				if (!message.member._roles.includes(String(await qh.getId("role", "admin")))) {
					message.channel.send("This command is only avaliable to Admins.").then().catch(e => console.error(e));
					return;
				} else {
					let data = await qh.getWeatherSchedule();

					if (data.status === "off") {
						message.channel.send("The weather scheduling is turned off.").then().catch(e => console.error(e));
						return;
					} else {
						await this.rollWeather();
					}
				}
				break;
			case "on":
				if (!message.member._roles.includes(String(await qh.getId("role", "admin"))) && 
					!message.member._roles.includes(String(await qh.getId("role", "weatherman")))) {
					message.channel.send("This command is only avaliable to Admins and Weatherman.").then().catch(e => console.error(e));
					return;
				}

				try {
					let data = await qh.getWeatherSchedule();

					if (data.status === "on") {
						message.channel.send("The scheduling is already on.").then().catch(e => console.error(e));
						return;
					}

					data.status = "on";
					await qh.updateWeatherSchedule(data);

					message.channel.send("Scheduling turned on.").then().catch(e => console.error(e));
				} catch(err) {
					message.channel.send("There was an error turning the scheduling on.").then().catch(e => console.error(e));
					console.log("There was an error turning the scheduling on: " + err);
				}
				break;
			case "off":
				if (!message.member._roles.includes(String(await qh.getId("role", "admin"))) && 
					!message.member._roles.includes(String(await qh.getId("role", "weatherman")))) {
					message.channel.send("This command is only avaliable to Admins and Weatherman.").then().catch(e => console.error(e));
					return;
				}

				try {
					let data = await qh.getWeatherSchedule();

					if (data.status === "off") {
						message.channel.send("The scheduling is already off.").then().catch(e => console.error(e));
						return;
					}

					data.status = "off";
					await qh.updateWeatherSchedule(data);

					message.channel.send("Scheduling turned off.").then().catch(e => console.error(e));
				} catch(err) {
					message.channel.send("There was an error turning the scheduling off.").then().catch(e => console.error(e));
					console.log("There was an error turning the scheduling off: " + err);
				}
				break;
			case "status":
				if (!message.member._roles.includes(String(await qh.getId("role", "admin"))) && 
					!message.member._roles.includes(String(await qh.getId("role", "weatherman")))) {
					message.channel.send("This command is only avaliable to Admins and Weatherman.").then().catch(e => console.error(e));
					return;
				}

				try {
					let data = await qh.getWeatherSchedule();
					message.channel.send("The weather scheduling is " + data.status + ".").then().catch(e => console.error(e));
				} catch(err) {
					message.channel.send("There was an error checking the scheduling status.").then().catch(e => console.error(e));
					console.log("There was an error checking the scheduling status: " + err);
				}
				break;
			case "changeWeatherChannel":
				if (!message.member._roles.includes(String(await qh.getId("role", "admin")))) {
					message.channel.send("This command is only avaliable to Admins.").then().catch(e => console.error(e));
					return;
				}

				try {
					let data = await qh.getWeatherSchedule();
					data.weatherchannel = message.channel.id;
					message.channel.send("Weather channel changed to this one.").then().catch(e => console.error(e));
					await qh.updateWeatherSchedule(data);
				} catch (err) {
					message.channel.send("There was an error trying to set the weather channel: " + err).then().catch(e => console.error(e));
					console.error("There was an error trying to set the weather channel: " + err);
				}
				break;
			case "changeForecastChannel":
				if (!message.member._roles.includes(String(await qh.getId("role", "admin")))) {
					message.channel.send("This command is only avaliable to Admins.").then().catch(e => console.error(e));
					return;
				}

				try {
					let data = await qh.getWeatherSchedule();
					data.forecastchannel = message.channel.id;
					message.channel.send("Forecast channel changed to this one.").then().catch(e => console.error(e));
					await qh.updateWeatherSchedule(data);
				} catch (err) {
					message.channel.send("There was an error trying to set the forecast channel: " + err).then().catch(e => console.error(e));
					console.error("There was an error trying to set the forecast channel: " + err);
				}
				break;
			default:
				message.channel.send("Avaliable arguments: on, off, status.\nAdmin only arguments: forceRoll, changeWeatherChannel, changeForecastChannel.").then().catch(e => console.error(e));
				break;
		}
	}
}