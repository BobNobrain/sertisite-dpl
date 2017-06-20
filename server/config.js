module.exports = {
	db: {
		host: '172.17.0.2',
		port: 3306,
		user: 'site',
		password: '123123',
		database: 'prod'
	},
	api: {
		root: '/api',
		calendar: '/cal',
		admin: '/admin/ls',
		checkOrg: '/org',
		types: '/types'
	},
	staticRoot: '/',
	staticFolder: './static'
};
