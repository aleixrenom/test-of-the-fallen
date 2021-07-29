const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'close',
	description: 'Closes an adventure channel.',
	cooldown: 1,
	async execute(message, args) {
		if (!message.member._roles.includes(String(await qh.getId("role", "staff")))) {
			message.channel.send("This command is only avaliable to Staff.");
			return;
		}

		switch(args[0]) {
			case "confirm":
				try {
					message.channel.setName("empty");
					message.channel.send("```\n-\n```");
					message.delete();
				} catch(e) {
					console.error("Error closing the adventure channel: " + e);
					message.channel.send("Error closing the adventure channel: " + e);
				}
				break;
			default:
				message.channel.send("Are you sure you want to close this adventure channel? If so, use `+close confirm`")
				message.delete({ timeout: 5000 });
				break;
		}
	},
};