const qh = require('../../components/queryHelper.js');
const cf = require('../../components/commonFunctions.js');
const { cp } = require('fs');

module.exports = {
	name: 'simulate',
	description: '',
	cooldown: 1,
	async execute(message, args) {
		if (!message.member._roles.includes(String(await qh.getId("role", "admin")))) {
			message.channel.send("This command is only avaliable to Admins.").then().catch(e => console.error(e));
			return;
		}

		/**
		 * Generates the said amount of randomised attacks.
		 * @param {Int} players Number of players attacking
		 * @returns {Array} Array of rolls between 1 and 3 equal to players
		 */
		const generateAttacks = (players) => {
			let attacksArray = [];

			for (let i = 0; i < players; i++) {
				attacksArray.push(cf.rnd(1,3));
			}

			return attacksArray;
		}

		/**
		 * Checks which attack damages your roll.
		 * @param {Int} attack The rolled attack
		 * @returns {Int} The roll that would damage the rolled attack
		 */
		const getDamagingAttack = (attack) => {
			switch (attack) {
				case 1:
					return 2;
					break;
				case 2:
					return 3;
					break;
				case 3:
					return 1;
					break;
				default:
					return 0;
					break;
			}
		}
		
		/**
		 * Simulates one combat against Iku.
		 * @param {Int} ikuHp HP that Iku has
		 * @returns {Boolean} returns true if players win, false if Iku wins
		 */
		const simulateCombat = (ikuHp) => {
			let combatFinished = false;
			let enemyHp = ikuHp;
			let playersHp = Array(7).fill(3);

			while (!combatFinished) {
				let playersAttacks = generateAttacks(playersHp.length);
				let ikuAttack = cf.rnd(1,3);

				playersAttacks.forEach(playerAttack => {
					if (playerAttack === getDamagingAttack(ikuAttack)) enemyHp -= 1;
				})

				if (enemyHp <= 0) return true;

				playersAttacks.forEach((playerAttack, index) => {
					if (ikuAttack === getDamagingAttack(playerAttack)) playersHp[index] -= 1;
				})

				playersHp = playersHp.filter(e => e > 0);

				if (playersHp.length <= 0) combatFinished = true;
			}

			return false;
		}

		// If the arguments are correct...
		if (args[0] && args[1] && !isNaN(args[0]) && !isNaN(args[1])) {
			let playerVictories = 0;
			let ikuVictories = 0;

			for (let i = 0; i < args[0]; i++) {
				if (simulateCombat(args[1])) {
					playerVictories += 1;
				} else {
					ikuVictories += 1;
				}
			}

			const returnString = `
			I ran ${args[0]} simulations setting Iku-turso's HP to ${args[1]}.
			Players won ${playerVictories} times.
			Iku-turso won ${ikuVictories} times.
			`;

			message.channel.send(returnString).then().catch(e => console.error(e));
		} else {
			// If the arguments are not correct...
			message.channel.send("Usage is `+simulate [number of simulations] [Iku's HP]`").then().catch(e => console.error(e));
		}
	},
};