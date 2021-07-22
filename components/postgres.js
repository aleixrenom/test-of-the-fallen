const { Pool, Client } = require("pg")
const connectionString = 'postgres://wcxaajqtfdtbsv:333c2e08a1ce5e5a247c50edf34a01ed8e4079715abae2f6c66953c65b0cffbf@ec2-52-22-161-59.compute-1.amazonaws.com:5432/d3jjvlmamsvrm1'

const dbClient = new Client ({
	connectionString:connectionString
})

function executeQuery(queryString) {
	try {
		let data;
		dbClient.connect()
		dbClient.query(queryString, (err,res)=>{
			console.log(err,res);
			data = res;
		})
		dbClient.end()

		if (data.length <= 1900) {
			return "```json\n" + data +  "\n```"
		} else {
			return "```json\n" + data.slice(0,1900) +  "\n```\n[Result too long. See the rest in the console's logs.]"
		}
	} catch(err) {
		console.error(err);
		return "There was an error trying to execute the query: " + err;
	}
}
