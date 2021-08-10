const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'archive',
	description: 'Archive this channel.',
	cooldown: 1,
	async execute(message) {
		if (!message.member._roles.includes(String(await qh.getId("role", "admin")))) {
			message.channel.send("This command is only avaliable to Admins.").then().catch(e => console.error(e));
			return;
		}
		
		message.channel.setParent(
			message.channel.guild.channels.cache.get('870261142373691392'),
			{ lockPermissions: true }
			)

		message.channel.send('```\nChannel archived\n```').then().catch(err => console.error(err));
	},
};