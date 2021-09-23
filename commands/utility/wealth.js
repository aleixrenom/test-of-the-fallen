const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	async execute(message, args) {
		
		function checkReturn(roll, inputMoney) {
			const multiplier = 0.02*parseInt(roll);
			return inputMoney*multiplier;
		}

		if (parseInt(args[0]) != NaN && parseInt(args[1]) != NaN) {
			message.channel.send("Return is " + checkReturn(parseInt(args[0]), parseInt(args[1]))).then().catch(e => console.error(e));
		} else {
			message.channel.send("Usage is `+wealth [roll] [amount]`").then().catch(e => console.error(e));
		}
	},
};