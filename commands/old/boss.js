const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'boss',
	description: 'Update boss health.',
	cooldown: 1,
	async execute(message, args) {
		if (!message.member._roles.includes(String(await qh.getId("role", "staff")))) {
			message.channel.send("This command is only avaliable to Staff.").then().catch(e => console.error(e));
			return;
		}

		switch(args[0]) {
			case("heal"):
				if (isNaN(parseInt(args[1]))) {
					message.channel.send("Given value is not a number.").then().catch(e => console.error(e));
					return;
				}
				if (args.length <= 1) {
					message.channel.send("Specify an amount of HP to heal.").then().catch(e => console.error(e));
					return;
				}

				try {
					const data = await qh.getStorage("boss_hp");
					const oldHp = parseInt(data[0].field_a);
					const newHp = oldHp + parseInt(args[1]);
					await qh.setStorage("boss_hp", newHp.toString(), null, null);

					const bossHpChannel = await qh.getId("channel", "boss_hp");
					cf.client.channels.cache.get(bossHpChannel.toString()).send(
						`__The Boss was healed!__\n` + 
						`**DM:** ${message.member.user.username}\n` + 
						`**Old HP:** ${oldHp}\n` +
						`**HP healed:** ${args[1]}\n` +
						`**New HP:** ${newHp}`
					).then().catch(e => console.error(e));

					message.channel.send("Boss HP updated successfuly.").then().catch(e => console.error(e));
				} catch(err) {
					console.error("Error modifying the boss hp: " + err);
					message.channel.send("Error modifying the boss hp: " + err).then().catch(e => console.error(e));
				}
			break;
			case("dmg"):
				if (isNaN(parseInt(args[1]))) {
					message.channel.send("Given value is not a number.").then().catch(e => console.error(e));
					return;
				}
				if (args.length <= 1) {
					message.channel.send("Specify an amount of HP to withdraw.").then().catch(e => console.error(e));
					return;
				}

				try {
					const data = await qh.getStorage("boss_hp");
					const oldHp = parseInt(data[0].field_a);
					const newHp = oldHp - parseInt(args[1]);
					await qh.setStorage("boss_hp", newHp.toString(), null, null);

					const bossHpChannel = await qh.getId("channel", "boss_hp");
					cf.client.channels.cache.get(bossHpChannel.toString()).send(
						`__The Boss was damaged!__\n` + 
						`**DM:** ${message.member.user.username}\n` + 
						`**Old HP:** ${oldHp}\n` +
						`**Damage:** ${args[1]}\n` +
						`**New HP:** ${newHp}`
					).then().catch(e => console.error(e));
					
					message.channel.send("Boss HP updated successfuly.").then().catch(e => console.error(e));
				} catch(err) {
					console.error("Error modifying the boss hp: " + err);
					message.channel.send("Error modifying the boss hp: " + err).then().catch(e => console.error(e));
				}
			break;
			default:
				message.channel.send("Usage:\n`+boss dmg [damage taken]`\n`+boss heal [health recovered]`").then().catch(e => console.error(e));
			break;
		}
	},
};