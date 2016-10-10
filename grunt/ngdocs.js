module.exports = {
	options: {
		html5Mode: false,
		title: 'Atlas API refrence',
		dest: 'build/docs',
		startPage: 'api/atlas.module:atlas'
	},
	all: [
		'modules/**/*.js'
	]
};