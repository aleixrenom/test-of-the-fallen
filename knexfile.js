module.exports = {
	development: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tablename: 'knex_migrations',
			directory: './data/migrations',
		},
		seeds: {
			directory: './data/seeds',
		}
	}
}