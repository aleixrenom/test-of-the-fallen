const cf = require('../../components/commonFunctions.js');
const fetchAll = require('discord-fetch-all');

module.exports = {
	name: 'archive',
	description: 'Send this channel to the RotF Archives',
	cooldown: 1,
	execute(message) {
		if (!message.member.roles.cache.has(cf.readDataFile('data').roles.admin)) {
			message.channel.send("This command is only avaliable to Admins.");
			return;
		}

	},
};