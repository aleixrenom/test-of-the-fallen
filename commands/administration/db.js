const Discord = require('discord.js');
const cf = require('../../components/commonFunctions.js');
const qh = require('../../components/queryHelper.js');

module.exports = {
	name: 'db',
	description: 'Interfaces with the database.',
	cooldown: 1,
	async execute(message, args) {
		if (!message.member.roles.cache.has(cf.readDataFile('data').roles.admin)) {
			message.channel.send("This command is only avaliable to Admins.");
			return;
		}

		switch (args[0]) {
			case "printTable":
				if (args.length > 1) {
					try {
						const data = await qh.readTable(args[1]);
						message.channel.send(args[1]);
						message.channel.send("```json\n" + data + "\n```");
					} catch(err) {
						console.error("Error printing table: " + err);
						message.channel.send("Error printing table: " + err);
					}
				} else {
					message.channel.send("Prints the content of a specified table.\nUsage: `+db printTable [table name]`")
				}
				break;
		}



		// function queryString() {
		// 	let str = "";
		// 	args.forEach(element => {
		// 		str += element + " "
		// 	});
		// 	return str.trim();
		// }
	},
};