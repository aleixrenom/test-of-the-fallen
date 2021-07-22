const Discord = require('discord.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'eq',
	description: 'Executes a query on the database.',
	cooldown: 1,
	execute(message, args) {
		if (!message.member.roles.cache.has(cf.readDataFile('data').roles.admin)) {
			message.channel.send("This command is only avaliable to Admins.");
			return;
		}

		function queryString() {
			let str = "";
			args.forEach(element => {
				str += element + " "
			});
			return str.trim();
		}

		message.channel.send(cf.executeQuery(queryString()));
	},
};