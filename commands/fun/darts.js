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
					"distance": "11ft",
					"scoredcs": {
						"fifty": "25",
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
					"color": 13569193,
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
						"name": "+darts throw [modifier]",
						"value": "The darts modifier is your dexterity modifier, and you can add your proficiency modifier if you have proficiency with simple weapons or with darts in particular."
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

				  message.channel.send({ embed: helpEmbed });
				break;
			case "start":
				try {
					const data = await qh.getStorage(message.author.id);
					
					if (data[0] != undefined) { // if this exists in the table...
						message.channel.send("Previously active game restarted.");
					} else { // if there's nothing with that name in the table...
						message.channel.send("Darts game started, you can now use `+darts throw [modifier]` to throw a dart."); 
					}

					// if they have given a number between 1 and 3...
					if (args[1] != undefined && 
						(
							args[1] == "1" ||
							args[1] == "2" ||
							args[1] == "3"
						)
					) {

						const selectedDificulty = args[1];
						// Fields: a = throws remaining, b = current score, c = difficulty
						await qh.setStorage(message.author.id, "5", "0", selectedDificulty);

					// if they have given something that's not a number between 1 and 3...
					} else if (args[1] != undefined) {
						message.channel.send("Difficulty level not recognized, please use a number between 1 and 3.")
							.then(m => m.delete({ timeout: 5000 }));
						message.delete();
						return;
					} else {

						// Fields: a = throws remaining, b = current score, c = difficulty
						await qh.setStorage(message.author.id, "5", "0", "2");

					}
					
					

				} catch(e) {
					console.error("Error starting a game of darts: " + e);
					message.channel.send("Error starting a game of darts: " + e);
				}
				break;
			case "throw":
				const data = await qh.getStorage(message.author.id);

				if (data[0] == undefined) {
					message.channel.send("You haven't started a game yet. Use `+darts start [optional difficulty]` to start one.")
						.then(m => m.delete({ timeout: 5000 }));
					message.delete({ timeout: 5000 });
					return;
				}

				if (isNaN(args[1])) {
					message.channel.send("The given modifier is not a number!")
						.then(m => m.delete({ timeout: 5000 }));
					message.delete({ timeout: 5000 });
					return;
				}

				const rollString = cf.roll("1d20+" + args[1]);
				console.log("rollString: " + rollString + " of type " + typeof rollString);
				const result = rollString.split(" ").pop();
				console.log("result: " + result + " of type " + typeof result);

				const diff = parseInt(data[0].field_c);
				console.log("diff: " + diff + " of type " + typeof diff);
				const throwDistance = scores[diff-1].distance;
				console.log("throwDistance: " + throwDistance + " of type " + typeof throwDistance);

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
				console.log("throwScore: " + throwScore + " of type " + typeof throwScore);
				const throwNumber = 6 - parseInt(data[0].field_a);
				console.log("throwNumber: " + throwNumber + " of type " + typeof throwNumber);
				const gameScore = parseInt(data[0].field_b) + throwScore;
				console.log("gameScore: " + gameScore + " of type " + typeof gameScore);

				const throwEmbed = new Discord.MessageEmbed()
					.setColor('#A92E51')
					.setTitle(`Throw ${throwNumber} out of 5`)
					.setDescription(rollString)
					.setThumbnail('https://img.icons8.com/emoji/452/bullseye.png')
					.addFields(
						{ name: 'Throw score', value: (throwScore >= 50) ? "50 - **Bullseye!**" : toString(throwScore) },
						{ name: 'Total game score', value: gameScore },
						{ name: 'Throw distance', value: throwDistance }
					)
					.setFooter(message.member.nickname, message.author.defaultAvatarURL)

				message.channel.send(throwEmbed)

				const throwsRemaining = parseInt(data[0].field_a) - 1;
				console.log("throwsRemaining: " + throwsRemaining + " of type " + typeof throwsRemaining);
				if (throwsRemaining <= 0) {
					await qh.deleteStorage(message.author.id);
					message.channel.send(`Game completed! Your final score is: **${gameScore}**`);
				} else {
					// Fields: a = throws remaining, b = current score, c = difficulty
					await qh.setStorage(message.author.id, throwsRemaining, gameScore, data[0].field_c);
				}

				break;
		}
	},
};
// */