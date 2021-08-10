// /*
const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');
const Discord = require('discord.js');

module.exports = {
	name: 'darts',
	description: 'Allows you to play a game of darts.',
	cooldown: 1,
	async execute(message, args) {
		const scores = 
			[
				{ 
					"difficulty": "1",
					"name": "Easy",
					"distance": "5ft",
					"scoredcs": {
						"fifty": "14",
						"thirty": "12",
						"twenty": "10",
						"ten": "8",
						"one": "6"
					}
				},
				{ 
					"difficulty": "2",
					"name": "Medium",
					"distance": "8ft",
					"scoredcs": {
						"fifty": "20",
						"thirty": "17",
						"twenty": "14",
						"ten": "11",
						"one": "8"
					}
				},
				{ 
					"difficulty": "3",
					"name": "Hard",
					"distance": "11ft",
					"scoredcs": {
						"fifty": "24",
						"thirty": "21",
						"twenty": "18",
						"ten": "15",
						"one": "12"
					}
				}
			]

		switch(args[0]) {
			default:
				const helpEmbed = {
					"color": "#A92E51",
					"author": {
					  "name": "Available arguments",
					  "icon_url": "https://img.icons8.com/emoji/452/bullseye.png"
					},
					"fields": [
					  {
						"name": "+darts start [optional difficulty]",
						"value": "Initiates or restarts a game of darts with 5 throws. The optional difficulties are: 1 to throw from a distance of 5ft, 2 to throw from a distance of 8ft (the default), and 3 to throw from a distance of 11ft."
					  },
					  {
						"name": "+darts throw [dex/str mod]",
						"value": "The darts modifier is your dexterity or strength modifier, and you cannot have advantage nor increase the modifier of the roll in any way."
					  },
					  {
						"name": "+darts score",
						"value": "Check your current score."
					  },
					  {
						"name": "+darts dcs",
						"value": "Check the score DCs relative to the throw difficulty."
					  }
					]
				  };

				  message.channel.send({ embeds: [helpEmbed] }).then().catch(e => console.error(e));
				break;
			case "start":
				try {
					const data = await qh.getStorage(message.author.id);
					
					// if they have given a number between 1 and 3...
					if (args[1] != undefined && 
						(
							args[1] == "1" ||
							args[1] == "2" ||
							args[1] == "3"
						)
					) {

						if (data[0] != undefined) { // if this exists in the table...
							message.channel.send("Previously active game restarted.").then().catch(e => console.error(e));
						} else { // if there's nothing with that name in the table...
							message.channel.send("Darts game started, you can now use `+darts throw [dex/str mod]` to throw a dart.").then().catch(e => console.error(e)); 
						}

						const selectedDificulty = args[1];
						// Fields: a = throws remaining, b = current score, c = difficulty
						await qh.setStorage(message.author.id, "5", "0", selectedDificulty);

					// if they have given something that's not a number between 1 and 3...
					} else if (args[1] != undefined) {
						message.channel.send("Difficulty level not recognized, please use a number between 1 and 3.")
							.then(m => setTimeout(() => m.delete(), 5000))
							.catch(e => console.error(e));
						message.delete();
						return;
					} else {

						// Fields: a = throws remaining, b = current score, c = difficulty
						await qh.setStorage(message.author.id, "5", "0", "2");

					}
					
					

				} catch(e) {
					console.error("Error starting a game of darts: " + e);
					message.channel.send("Error starting a game of darts: " + e).then().catch(e => console.error(e));
				}
				break;
			case "throw":
				const data = await qh.getStorage(message.author.id);

				if (data[0] == undefined) {
					message.channel.send("You haven't started a game yet. Use `+darts start [optional difficulty]` to start one.")
						.then(m => setTimeout(() => m.delete(), 5000))
						.catch(e => console.error(e));
					message.delete({ timeout: 5000 });
					return;
				}

				if (isNaN(args[1])) {
					message.channel.send("The given modifier is not a number!")
						.then(m => setTimeout(() => m.delete(), 5000))
						.catch(e => console.error(e));
					message.delete({ timeout: 5000 });
					return;
				}

				const rollString = cf.roll("1d20+" + args[1]);
				const result = rollString.split(" ").pop();

				const diff = parseInt(data[0].field_c);
				const throwDistance = scores[diff-1].distance;

				function checkScore(result, throwDifficulty) {
					const n = parseInt(result);
					if (n >= scores[throwDifficulty-1].scoredcs.fifty) {
						return 50;
					} else if (n >= scores[throwDifficulty-1].scoredcs.thirty) {
						return 30;
					} else if (n >= scores[throwDifficulty-1].scoredcs.twenty) {
						return 20;
					} else if (n >= scores[throwDifficulty-1].scoredcs.ten) {
						return 10;
					} else if (n >= scores[throwDifficulty-1].scoredcs.one) {
						return 1;
					} else {
						return 0;
					}
				}

				const throwScore = checkScore(result, diff);
				const throwNumber = 6 - parseInt(data[0].field_a);
				const gameScore = parseInt(data[0].field_b) + throwScore;

				const throwEmbed = new Discord.MessageEmbed()
					.setColor('#A92E51')
					.setTitle(`Throw ${throwNumber} out of 5`)
					.setDescription(rollString)
					.setThumbnail('https://img.icons8.com/emoji/452/bullseye.png')
					.addFields(
						{ name: 'Throw score', value: (throwScore >= 50) ? "50 - **Bullseye!**" : throwScore },
						{ name: 'Total game score', value: gameScore },
						{ name: 'Throw distance', value: throwDistance }
					)
					.setFooter(message.author.tag.toString(), message.author.displayAvatarURL())

				message.channel.send({ embeds: [throwEmbed] }).then().catch(e => console.error(e));

				const throwsRemaining = parseInt(data[0].field_a) - 1;
				if (throwsRemaining <= 0) {
					await qh.deleteStorage(message.author.id);
					message.channel.send(`Game completed! Your final score is: **${gameScore}**`).then().catch(e => console.error(e));
				} else {
					// Fields: a = throws remaining, b = current score, c = difficulty
					await qh.setStorage(message.author.id, throwsRemaining, gameScore, data[0].field_c);
				}

				message.delete();

				break;
			case "score":
				const scoreData = await qh.getStorage(message.author.id);

				console.log(message.author.displayAvatarURL() + " of type " + typeof message.author.displayAvatarURL())

				if (scoreData[0] != undefined) { // if this exists in the table...
					message.channel.send(
						`Your current score is **${scoreData[0].field_b}** with **${scoreData[0].field_a}** throws remaining, throwing from a distance of **${scores[parseInt(scoreData[0].field_c)-1].distance}**.`
					).then().catch(e => console.error(e))
				} else { // if there's nothing with that name in the table...
					message.channel.send("You haven't started a game yet. Use `+darts start [optional difficulty]` to start one.").then().catch(e => console.error(e)); 
				}

				break;
			case "dcs":
				let fields = {};

				scores.forEach(element => {
					fields[element.name] = { 
						name: `${element.difficulty} - ${element.name} - ${element.distance}`,
						value: `50 points = DC ${element.scoredcs.fifty}\n30 points = DC ${element.scoredcs.thirty}\n20 points = DC ${element.scoredcs.twenty}\n10 points = DC ${element.scoredcs.ten}\n1 point = DC ${element.scoredcs.one}`
					}
				})

				const dcsEmbed = new Discord.MessageEmbed()
					.setColor('#A92E51')
					.setTitle("DCs")
					.setDescription("Points received depending on the game's difficulty and the throw result.")
					.setThumbnail('https://img.icons8.com/emoji/452/bullseye.png')
					.addFields(fields.Easy, fields.Medium, fields.Hard)
					.setFooter(message.author.tag.toString(), message.author.displayAvatarURL());

				message.channel.send({ embeds: [dcsEmbed] }).then().catch(e => console.error(e));

				break;
		}
	},
};
// */