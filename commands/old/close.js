const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'close',
	description: 'Closes an adventure channel.',
	cooldown: 1,
	async execute(message, args) {
		if (!message.member._roles.includes(String(await qh.getId("role", "staff")))) {
			message.channel.send("This command is only avaliable to Staff.").then().catch(e => console.error(e));
			return;
		}

		if (message.channel.parentID != '758053464491425966') {
			message.channel.send("This command is only usable in the Island Adventures category.").then().catch(e => console.error(e));
			return;
		}

		switch(args[0]) {
			case "confirm":
				try {
					message.channel.setName("empty");
					message.channel.send("```\n-\n```").then().catch(e => console.error(e));
					message.channel.messages.fetchPinned()
						.then(messages => messages.each(
							(m) => {
								m.unpin();
							}
						))
						.catch(console.error);
					message.channel.setPosition(message.channel.parent.children.size-1);
					message.delete();
				} catch(e) {
					console.error("Error closing the adventure channel: " + e);
					message.channel.send("Error closing the adventure channel: " + e).then().catch(e => console.error(e));
				}
				break;
			default:
				message.channel.send("Are you sure you want to close this adventure channel? If so, use `+close confirm`")
					.then(m => setTimeout(() => m.delete(), 5000))
					.catch(e => console.error(e));
				setTimeout(() => message.delete(), 5000);
				break;
		}
	},
};