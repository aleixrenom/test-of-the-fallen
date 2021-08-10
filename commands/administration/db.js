const Discord = require('discord.js');
const cf = require('../../components/commonFunctions.js');
const qh = require('../../components/queryHelper.js');

module.exports = {
	name: 'db',
	description: 'Interfaces with the database.',
	cooldown: 1,
	async execute(message, args) {
		if (!message.member._roles.includes(String(await qh.getId("role", "admin")))) {
			message.channel.send("This command is only avaliable to Admins.").then().catch(e => console.error(e));
			return;
		}

		switch (args[0]) {
			case "readTable":
				if (args.length > 1) {
					try {
						const data = await qh.readTable(args[1]);
						message.channel.send("```json\n" + JSON.stringify(data, null, 2) + "\n```").then().catch(e => console.error(e));
					} catch(err) {
						console.error("Error printing table: " + err);
						message.channel.send("Error printing table: " + err).then().catch(e => console.error(e));
					}
				} else {
					message.channel.send("Prints the content of a specified table.\nUsage: `+db printTable [table name]`").then().catch(e => console.error(e));
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