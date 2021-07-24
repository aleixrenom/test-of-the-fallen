const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message) {
		// let data = await qh.getWeatherSchedule();
		// message.channel.send(data.status);
		// message.channel.send(cf.client.channels.cache.get(message.channel.id).id);
		// message.channel.send(cf.client.channels.cache.get(message.channel.id)).then().catch(err => console.error(err));
		// message.channel.send('Pong.').then().catch(err => console.error(err));

		await qh.updateWeatherSchedule({
			status: "on",
			type: "Clear Skies",
			temperature: "21°C / 69.8°F",
			lightning: "None",
			winds: "7mph (Gentle breeze)",
			image: "https://cdn.glitch.com/aabc7c04-7768-48f9-b0a0-f1621bd9d381%2Fclear_skies.png?v=1581434913716",
			color: 16044095,
			forecastChannel: 868417961013153872,
			weatherChannel: 868417936853983242
		});
	},
};