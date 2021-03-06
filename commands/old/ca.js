const cf = require('../../components/commonFunctions.js');
const Discord = require('discord.js');

module.exports = {
	name: 'ca',
	description: 'Command to automate the Path of the Chaos Avatar.',
	execute(message, args) {
	switch (args[0]) {
		case "roll":
			let maxDieFaces = 1;
			if (args[1] == 1) maxDieFaces = 8;
			else if (args[1] == 2) maxDieFaces = 16;
			else if (args[1] == 3) maxDieFaces = 25;
			else if (args[1] == 4) maxDieFaces = 33;
			else if (args[1] == 5) maxDieFaces = 41;
			else if (args[1] == 6) maxDieFaces = 50;
			else if (args[1] == 7) maxDieFaces = 58;
			else if (args[1] == 8) maxDieFaces = 66;
			else if (args[1] == 9) maxDieFaces = 75;
			else if (args[1] == 10) maxDieFaces = 83;
			else if (args[1] == 11) maxDieFaces = 91;
			else if (args[1] == 12) maxDieFaces = 100;
			else {
				message.channel.send("Error: invalid stage number.");
				return;
			}

			function makeColor(croll) {
				const lerp = (x, y, a) => x * (1 - a) + y * a; // lerp(20, 80, 0.5) --> 40
				let R = 255;
				let G = 255;
				let B = 255;

				// white to black
				// if (croll <= 50) {
				// 	R = lerp(255, 0, croll/50);
				// 	G = lerp(255, 0, croll/50);
				// 	B = 255;
				// } else {
				// 	const rollDivided = croll - 50;
				// 	R = 0
				// 	G = 0
				// 	B = lerp(255, 0, rollDivided/50);
				// }

				// black to white
				if (croll <= 50) {
					R = 0
					G = 0
					B = lerp(0, 255, croll/50);
				} else {
					const rollDivided = croll - 50;
					R = lerp(0, 255, rollDivided/50);
					G = lerp(0, 255, rollDivided/50);
					B = 255
				}

				const newColor = [R, G, B];
				return newColor;
			}

			const croll = cf.rnd(0,maxDieFaces-1); // one less because zero-based arrays and that shiz
			const cdataFile = cf.readDataFile('chaosAvatarEffects');
			const csEmbed = new Discord.MessageEmbed()
			  .setColor(makeColor(croll))
			  .setTitle("Roll: 1d" + maxDieFaces + " (" + cdataFile.chaosEffectsTable[croll].roll + ")")
			  .setDescription(cdataFile.chaosEffectsTable[croll].effect);
			
			if (cdataFile.chaosEffectsTable[croll].rolls === undefined || cdataFile.chaosEffectsTable[croll].rolls == 0) {
				message.channel.send(csEmbed);
			} else {
				cdataFile.chaosEffectsTable[croll].rolls.forEach(element => {
					csEmbed.addField(element.title, cf.roll(element.roll));
				});
				message.channel.send(csEmbed);
			}
			
		break;
		case "blast":

			const embed = {
				"title": "Avatar blast",
				"description": "Choose 1d10+2 5ft squares that you can see within 2d20*5 feet of you. Creatures in those squares must make a dexterity saving throw or take 4d10 force damage, or half on a successful save.",
				"color": 5978111,
				"fields": [
				  {
					"name": "Area",
					"value": cf.roll("1d10+2") + " squares"
				  },
				  {
					"name": "Range",
					"value": cf.roll("2d20*5") + " feet"
				  },
				  {
					"name": "Force damage",
					"value": cf.roll("4d10")
				  }
				]
			  };
			  message.channel.send({ embed });

		break;
		case "avatarspark":

			const roll = cf.rnd(0,9); // one less because zero-based arrays and that shiz
			const dataFile = cf.readDataFile('chaosAvatarEffects');
			const asEmbed = new Discord.MessageEmbed()
			  .setColor([128,0,128])
			  .setTitle("Avatar spark roll: 1d10 (" + dataFile.avatarEffectsTable[roll].roll + ")")
			  .setDescription(dataFile.avatarEffectsTable[roll].effect);
			
			if (dataFile.avatarEffectsTable[roll].rolls === undefined || dataFile.avatarEffectsTable[roll].rolls == 0) {
				message.channel.send(asEmbed);
			} else {
				dataFile.avatarEffectsTable[roll].rolls.forEach(element => {
					asEmbed.addField(element.title, cf.roll(element.roll));
				});
				message.channel.send(asEmbed);
			}

		break;
    case "forceroll":

      
      function makeColorB(crollB) {
				const lerp = (x, y, a) => x * (1 - a) + y * a; // lerp(20, 80, 0.5) --> 40
				let R = 255;
				let G = 255;
				let B = 255;

				// white to black
				// if (crollB <= 50) {
				// 	R = lerp(255, 0, crollB/50);
				// 	G = lerp(255, 0, crollB/50);
				// 	B = 255;
				// } else {
				// 	const rollDivided = crollB - 50;
				// 	R = 0
				// 	G = 0
				// 	B = lerp(255, 0, rollDivided/50);
				// }

				// black to white
			  if (crollB <= 50) {
					R = 0
					G = 0
					B = lerp(0, 255, crollB/50);
				} else {
					const rollDivided = crollB - 50;
					R = lerp(0, 255, rollDivided/50);
					G = lerp(0, 255, rollDivided/50);
					B = 255
				}

				const newColor = [R, G, B];
				return newColor;
			}

			if (parseInt(args[1]) >= 1 && parseInt(args[1]) <= 100) {
        
      } else {
        message.channel.send("Error: invalid roll number.");
				return;
      }
      
      const maxDieFacesB = 100;
      const crollB = parseInt(args[1]) - 1;
			const cdataFileB = cf.readDataFile('chaosAvatarEffects');
			const csEmbedB = new Discord.MessageEmbed()
			  .setColor(makeColorB(crollB))
			  .setTitle("Roll: 1d" + maxDieFacesB + " (" + cdataFileB.chaosEffectsTable[crollB].roll + ")")
			  .setDescription(cdataFileB.chaosEffectsTable[crollB].effect);
			
			if (cdataFileB.chaosEffectsTable[crollB].rolls === undefined || cdataFileB.chaosEffectsTable[crollB].rolls == 0) {
				message.channel.send(csEmbedB);
			} else {
				cdataFileB.chaosEffectsTable[crollB].rolls.forEach(element => {
					csEmbedB.addField(element.title, cf.roll(element.roll));
				});
				message.channel.send(csEmbedB);
			}
    break;
		default:
			message.channel.send("The avaliable arguments are:\n`+ca roll [stage]`\n`+ca blast`\n`+ca avatarspark`");
	}
	},
};