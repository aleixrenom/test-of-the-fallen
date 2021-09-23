const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');

module.exports = {
	name: 'wealth',
	description: 'Returns the correct wealth for vending machine event.',
	cooldown: 1,
	async execute(message, args) {
		
		function checkReturn(roll, inputMoney) {
			const multiplier = 0.02*parseInt(roll);
			return inputMoney*multiplier;
		}

		if (!isNaN(args[0]) && !isNaN(args[1]) && args[0] != undefined) {
			message.channel.send("Return is " + checkReturn(parseInt(args[0]), parseInt(args[1]))).then().catch(e => console.error(e));
		} else {
			message.channel.send("Usage is `+wealth [roll] [amount]`").then().catch(e => console.error(e));
		}
	},
};