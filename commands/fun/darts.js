const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');
const scores = 
{
	"1": { 
		"difficulty": "1",
		"distance": "5ft",
		"scoredcs": {
			"50": "14",
			"30": "12",
			"20": "10",
			"10": "8",
			"1": "6"
		}
	},
	"2": { 
		"difficulty": "2",
		"distance": "8ft",
		"scoredcs": {
			"50": "20",
			"30": "17",
			"20": "14",
			"10": "11",
			"1": "8"
		}
	},
	"3": { 
		"difficulty": "3",
		"distance": "11ft",
		"scoredcs": {
			"50": "25",
			"30": "21",
			"20": "18",
			"10": "15",
			"1": "12"
		}
	}
}

module.exports = {
	name: 'darts',
	description: 'Allows you to play a game of darts.',
	cooldown: 1,
	async execute(message, args) {
		switch(args[0]) {
			default:
				message.channel.send(
					"Possible arguments:" +
					"\n\n`+darts start [optional difficulty]`\nInitiates or restarts a game of darts with 5 throws. The optional difficulties are: 1 to throw from a distance of 5ft, 2 to throw from a distance of 8ft (the defaul), and 3 to throw from a distance of 11ft." +
					"\n\n`+darts throw [modifier]`\nThe darts modifier is your dexterity modifier, and you can add your proficiency modifier if you have proficiency with simple weapons or with darts in particular." +
					"\n\n`+darts dcs`\nCheck the score DCs relative to the throw difficulty."
				)
				break;
			case "start":
				try {
					// const data = await qh.getStorage(message.author.id);
					const data = await qh.getStorage(args[1]);
					console.log(data);
					message.channel.send(data.name.toString());
				} catch(e) {
					console.error("Error starting a game of darts: " + e);
					message.channel.send("Error starting a game of darts: " + e);
				}
				break;
		}
	},
};