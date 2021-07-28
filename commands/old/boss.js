const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'boss',
	description: 'Update boss health.',
	cooldown: 1,
	async execute(message, args) {
		if (!message.member._roles.includes(String(await qh.getId("role", "staff")))) {
			message.channel.send("This command is only avaliable to Staff.");
			return;
		}

		if (args.length <= 0) {
			message.channel.send("Usage: `+boss [change in hp]`");
		} else {
			try {
				const data = await qh.getStorage("boss_hp");
				const oldHp = parseInt(data.field_a);
				const newHp = oldHp + parseInt(args[1]);
				await qh.setStorage("boss_hp", newHp.toString, null, null);
				console.log(message.member.id + " changed the boss HP from " + oldHp + " to " + newHp);
				cf.client.channels.cache.get(await qh.getId("channel", "boss_hp")).send(
					message.member.id + " changed the boss HP from " + oldHp + " to " + newHp
				);
				message.channel.send("Boss HP updated successfuly.");
			} catch(err) {
				console.error("Error modifying the boss hp: " + err);
				message.channel.send("Error modifying the boss hp: " + err);
			}
		}
	},
};